import React, { createContext, useContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { collection, doc, onSnapshot, query, where } from 'firebase/firestore';
import { db, testFirestoreConnection, handleFirestoreError, OperationType } from '../lib/firebase';
import {
  Category,
  Product,
  ProductVariant,
  StorefrontConfig,
  CartItem,
} from '../types/commerce';
import {
  ALL_SEED_PRODUCTS,
  DEFAULT_STOREFRONT_CONFIG,
  INITIAL_CATEGORIES,
  LEGACY_PLACEHOLDER_PRODUCT_IDS,
  MIREZA_IMAGES,
  OBSOLETE_CATEGORY_IDS,
} from '../lib/catalogDefaults';
import { useAuth } from './AuthContext';
import {
  seedInitialCatalogClient,
  ensureDefaultCategories,
  ensureFullSampleCatalog,
} from '../lib/firestoreService';
import { sanitizeId } from '../lib/format';

export type RouteView =
  | { page: 'home' }
  | { page: 'shop' }
  | { page: 'new-drop' }
  | { page: 'category'; slug: string }
  | { page: 'collection'; slug: string }
  | { page: 'product'; slug: string }
  | { page: 'cart' }
  | { page: 'checkout' }
  | { page: 'account' }
  | { page: 'orders' }
  | { page: 'legal'; docType: 'shipping' | 'returns' | 'privacy' | 'terms' }
  | { page: 'admin'; tab?: string };

function parseHashOrPath(): RouteView {
  const pathname = window.location.pathname;
  if (pathname === '/shop') return { page: 'shop' };
  if (pathname === '/new-drop') return { page: 'new-drop' };
  if (pathname.startsWith('/category/')) {
    return { page: 'category', slug: pathname.replace('/category/', '') };
  }
  if (pathname.startsWith('/collection/')) {
    return { page: 'collection', slug: pathname.replace('/collection/', '') };
  }
  if (pathname.startsWith('/product/')) {
    return { page: 'product', slug: pathname.replace('/product/', '') };
  }
  if (pathname === '/cart') return { page: 'cart' };
  if (pathname === '/checkout') return { page: 'checkout' };
  if (pathname === '/account') return { page: 'account' };
  if (pathname === '/orders') return { page: 'orders' };
  if (pathname.startsWith('/legal/')) {
    const t = pathname.replace('/legal/', '') as any;
    if (['shipping', 'returns', 'privacy', 'terms'].includes(t)) {
      return { page: 'legal', docType: t };
    }
  }
  if (pathname.startsWith('/admin')) {
    const tab = pathname.replace('/admin', '').replace(/^\//, '') || 'overview';
    return { page: 'admin', tab };
  }
  return { page: 'home' };
}

interface ToastMessage {
  id: number;
  text: string;
  tone: 'default' | 'error' | 'success';
}

interface StoreContextValue {
  route: RouteView;
  navigate: (path: string) => void;
  categories: Category[];
  products: Product[];
  allProductsAdmin: Product[];
  variants: ProductVariant[];
  storefrontConfig: StorefrontConfig;
  loadingCatalog: boolean;
  catalogEmpty: boolean;
  cart: CartItem[];
  cartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  addToCart: (item: CartItem, openDrawer?: boolean) => void;
  updateCartQty: (variantId: string, qty: number) => void;
  removeFromCart: (variantId: string) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotalXof: number;
  getProductVariants: (productId: string) => ProductVariant[];
  toast: (text: string, tone?: 'default' | 'error' | 'success') => void;
  initializeCatalog: () => Promise<boolean>;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);
const CART_STORAGE_KEY = 'mireza_bag_v1';

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, authReady } = useAuth();
  const [route, setRoute] = useState<RouteView>(() => parseHashOrPath());
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [allProductsAdmin, setAllProductsAdmin] = useState<Product[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [storefrontConfig, setStorefrontConfig] = useState<StorefrontConfig>(
    DEFAULT_STOREFRONT_CONFIG
  );
  const [loadingCatalog, setLoadingCatalog] = useState(true);
  const [cartOpen, setCartOpen] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);
  const syncedSampleRef = useRef(false);

  const fallbackCategories: Category[] = useMemo(
    () => INITIAL_CATEGORIES.map((c) => ({ ...c })),
    []
  );

  const { fallbackProducts, fallbackVariants } = useMemo(() => {
    const prods: Product[] = [];
    const vars: ProductVariant[] = [];
    for (const p of ALL_SEED_PRODUCTS) {
      prods.push({
        id: p.id,
        name: p.name,
        slug: p.slug,
        description: p.description,
        categoryId: p.categoryId,
        categoryName: p.categoryName,
        sku: p.sku,
        externalShopifyHandle: p.slug,
        images: p.images,
        colors: p.colors.map((c) => c.name),
        sizes: p.sizes,
        regularPriceXof: p.regularPriceXof,
        promoPriceXof: p.promoPriceXof,
        lowStockThreshold: p.lowStockThreshold,
        status: 'published',
        isNewDrop: p.isNewDrop,
        newDropOrder: p.newDropOrder,
        isFeatured: p.isFeatured,
        featuredOrder: p.featuredOrder,
        isPreorder: Boolean(p.isPreorder),
        preorderEstimateDate: p.preorderEstimateDate ?? null,
      });
      for (const color of p.colors) {
        for (const size of p.sizes) {
          const key = `${color.name}-${size}`;
          const qty = p.stockMatrix[key] ?? 5;
          const variantId = sanitizeId(
            `var_${p.sku}_${color.name.replace(/\s+/g, '')}_${size.replace(/\s+/g, '')}`
          );
          const sku = `${p.sku}-${color.name.slice(0, 3).toUpperCase()}-${size
            .replace(/\s+/g, '')
            .toUpperCase()}`;
          vars.push({
            id: variantId,
            productId: p.id,
            sku,
            color: color.name,
            colorHex: color.hex,
            size,
            priceXof: p.promoPriceXof ?? p.regularPriceXof,
            compareAtPriceXof: p.promoPriceXof ? p.regularPriceXof : null,
            stockQty: qty,
            reservedQty: 0,
            lowStockThreshold: p.lowStockThreshold,
            weightGrams: 300,
            isActive: true,
          });
        }
      }
    }
    return { fallbackProducts: prods, fallbackVariants: vars };
  }, []);

  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    const onPop = () => {
      setRoute(parseHashOrPath());
      window.scrollTo({ top: 0, behavior: 'auto' });
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

  const navigate = useCallback((path: string) => {
    if (window.location.pathname !== path) {
      window.history.pushState({}, '', path);
    }
    setRoute(parseHashOrPath());
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const toast = useCallback((text: string, tone: 'default' | 'error' | 'success' = 'default') => {
    const id = Date.now() + Math.floor(Math.random() * 1000);
    setToasts((prev) => [...prev, { id, text, tone }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3800);
  }, []);

  // Test Firestore connection on boot
  useEffect(() => {
    testFirestoreConnection();
  }, []);

  // Subscribe to public storefront catalog (categories, published products, active variants, CMS config)
  useEffect(() => {
    const unsubConfig = onSnapshot(
      doc(db, 'storefront_config', 'main'),
      (snap) => {
        if (snap.exists()) {
          const raw = snap.data() as StorefrontConfig;
          const patchedHero =
            typeof raw.heroImageUrl === 'string' && raw.heroImageUrl.includes('1794923269199')
              ? MIREZA_IMAGES.hero
              : raw.heroImageUrl;
          const patchedIntro =
            typeof raw.brandIntroImageUrl === 'string' &&
            (raw.brandIntroImageUrl.includes('1794923275052') ||
              raw.brandIntroImageUrl.includes('caribbean_banner') ||
              raw.brandIntroImageUrl.includes('/src/assets/images/'))
              ? MIREZA_IMAGES.brandIntro
              : raw.brandIntroImageUrl;
          const patchedGallery =
            Array.isArray(raw.galleryItems) &&
            raw.galleryItems.some(
              (g) =>
                g.imageUrl?.includes('179492327') ||
                g.imageUrl?.includes('17949403') ||
                g.imageUrl?.startsWith('/assets/jersey/')
            )
              ? DEFAULT_STOREFRONT_CONFIG.galleryItems
              : raw.galleryItems;
          const hasStaleSweatText =
            typeof raw.brandIntroBody === 'string' && raw.brandIntroBody.toLowerCase().includes('sweat wear');

          const isLegacyCms = !raw.cmsVersion || raw.cmsVersion < 4;
          const existingCustomKeys = Array.isArray(raw.sectionOrder)
            ? raw.sectionOrder.filter((s) => typeof s === 'string' && s.startsWith('custom:'))
            : [];
          const patchedSectionOrder = isLegacyCms
            ? [...DEFAULT_STOREFRONT_CONFIG.sectionOrder, ...existingCustomKeys]
            : Array.isArray(raw.sectionOrder) && raw.sectionOrder.length > 0
              ? raw.sectionOrder
              : DEFAULT_STOREFRONT_CONFIG.sectionOrder;

          const cleanLegacyDropLabel = (val: string | undefined, fallback: string) =>
            !val || val.toLowerCase().includes('prochain drop') ? fallback : val;

          setStorefrontConfig({
            ...DEFAULT_STOREFRONT_CONFIG,
            ...raw,
            heroImageUrl: patchedHero || MIREZA_IMAGES.hero,
            heroSecondaryCtaLabel: isLegacyCms
              ? cleanLegacyDropLabel(
                  raw.heroSecondaryCtaLabel,
                  DEFAULT_STOREFRONT_CONFIG.heroSecondaryCtaLabel || 'Nouvelle Collection'
                )
              : raw.heroSecondaryCtaLabel,
            heroSecondaryCtaHref:
              isLegacyCms && (!raw.heroSecondaryCtaHref || raw.heroSecondaryCtaHref === '/category/accessories')
                ? DEFAULT_STOREFRONT_CONFIG.heroSecondaryCtaHref
                : raw.heroSecondaryCtaHref || DEFAULT_STOREFRONT_CONFIG.heroSecondaryCtaHref,
            nextDropLeftCtaLabel: isLegacyCms
              ? cleanLegacyDropLabel(
                  raw.nextDropLeftCtaLabel,
                  DEFAULT_STOREFRONT_CONFIG.nextDropLeftCtaLabel || 'Découvrir la Collection'
                )
              : raw.nextDropLeftCtaLabel || DEFAULT_STOREFRONT_CONFIG.nextDropLeftCtaLabel,
            nextDropLeftCtaHref:
              isLegacyCms && (!raw.nextDropLeftCtaHref || raw.nextDropLeftCtaHref === '/category/accessories')
                ? DEFAULT_STOREFRONT_CONFIG.nextDropLeftCtaHref
                : raw.nextDropLeftCtaHref || DEFAULT_STOREFRONT_CONFIG.nextDropLeftCtaHref,
            nextDropRightCtaLabel:
              isLegacyCms && (!raw.nextDropRightCtaLabel || raw.nextDropRightCtaLabel === 'Explorer New Drop')
                ? DEFAULT_STOREFRONT_CONFIG.nextDropRightCtaLabel
                : raw.nextDropRightCtaLabel || DEFAULT_STOREFRONT_CONFIG.nextDropRightCtaLabel,
            nextDropRightCtaHref:
              isLegacyCms && (!raw.nextDropRightCtaHref || raw.nextDropRightCtaHref === '/new-drop')
                ? DEFAULT_STOREFRONT_CONFIG.nextDropRightCtaHref
                : raw.nextDropRightCtaHref || DEFAULT_STOREFRONT_CONFIG.nextDropRightCtaHref,
            brandIntroSecondaryCtaLabel: isLegacyCms
              ? cleanLegacyDropLabel(
                  raw.brandIntroSecondaryCtaLabel,
                  DEFAULT_STOREFRONT_CONFIG.brandIntroSecondaryCtaLabel || 'Nouvelle Collection'
                )
              : raw.brandIntroSecondaryCtaLabel,
            brandIntroSecondaryCtaHref:
              isLegacyCms && (!raw.brandIntroSecondaryCtaHref || raw.brandIntroSecondaryCtaHref === '/category/accessories')
                ? DEFAULT_STOREFRONT_CONFIG.brandIntroSecondaryCtaHref
                : raw.brandIntroSecondaryCtaHref || DEFAULT_STOREFRONT_CONFIG.brandIntroSecondaryCtaHref,
            brandIntroImageUrl: patchedIntro || DEFAULT_STOREFRONT_CONFIG.brandIntroImageUrl,
            brandIntroBody: hasStaleSweatText
              ? DEFAULT_STOREFRONT_CONFIG.brandIntroBody
              : raw.brandIntroBody || DEFAULT_STOREFRONT_CONFIG.brandIntroBody,
            newsletterBody:
              typeof raw.newsletterBody === 'string' && raw.newsletterBody.toLowerCase().includes('sweat wear')
                ? DEFAULT_STOREFRONT_CONFIG.newsletterBody
                : raw.newsletterBody || DEFAULT_STOREFRONT_CONFIG.newsletterBody,
            campaignBannerText:
              typeof raw.campaignBannerText === 'string' && raw.campaignBannerText.toLowerCase().includes('sweat wear')
                ? DEFAULT_STOREFRONT_CONFIG.campaignBannerText
                : raw.campaignBannerText || DEFAULT_STOREFRONT_CONFIG.campaignBannerText,
            sectionOrder: patchedSectionOrder,
            collectionBanners:
              Array.isArray(raw.collectionBanners) && raw.collectionBanners.length > 0
                ? raw.collectionBanners
                : DEFAULT_STOREFRONT_CONFIG.collectionBanners,
            customSections: Array.isArray(raw.customSections) ? raw.customSections : [],
            galleryItems: patchedGallery || DEFAULT_STOREFRONT_CONFIG.galleryItems,
          });
        }
      },
      (err) => {
        console.warn('Storefront config listener warning:', err);
      }
    );

    const unsubCategories = onSnapshot(
      query(collection(db, 'categories'), where('isActive', '==', true)),
      (snap) => {
        const mapped = snap.docs
          .filter((d) => !OBSOLETE_CATEGORY_IDS.includes(d.id))
          .map((d) => {
            const data = d.data() as Omit<Category, 'id'>;
            const defaultCat = INITIAL_CATEGORIES.find((c) => c.id === d.id);
            const isLegacyImg =
              typeof data.imageUrl === 'string' &&
              (data.imageUrl.includes('179492') ||
                data.imageUrl.includes('179493') ||
                data.imageUrl.includes('17949403') ||
                data.imageUrl.includes('/assets/aistudio/image_2e3'));
            return {
              id: d.id,
              ...data,
              name: defaultCat ? defaultCat.name : data.name,
              slug: defaultCat ? defaultCat.slug : data.slug,
              imageUrl: isLegacyImg && defaultCat ? defaultCat.imageUrl : data.imageUrl,
            };
          });

        // Ensure Set, Sweat Wear, and Accessories also appear cleanly even before admin triggers Firestore sync
        const existingIds = new Set(mapped.map((c) => c.id));
        const merged = [
          ...mapped,
          ...INITIAL_CATEGORIES.filter((c) => !existingIds.has(c.id)).map((c) => ({ ...c })),
        ].sort((a, b) => (a.sortOrder ?? 99) - (b.sortOrder ?? 99));

        setCategories(merged);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'categories')
    );

    const unsubProducts = onSnapshot(
      query(collection(db, 'products'), where('status', '==', 'published')),
      (snap) => {
        const list = snap.docs
          .filter((d) => !LEGACY_PLACEHOLDER_PRODUCT_IDS.includes(d.id))
          .map((d) => {
            const raw = { id: d.id, ...(d.data() as Omit<Product, 'id'>) };
            const seedMatch = ALL_SEED_PRODUCTS.find((s) => s.id === d.id);
            if (seedMatch) {
              return {
                ...raw,
                images: seedMatch.images,
                categoryName: seedMatch.categoryName,
                isNewDrop: seedMatch.isNewDrop,
                newDropOrder: seedMatch.newDropOrder,
                isFeatured: seedMatch.isFeatured,
                featuredOrder: seedMatch.featuredOrder,
              };
            }
            return raw;
          });
        setProducts(list);
        setLoadingCatalog(false);
      },
      (err) => {
        setLoadingCatalog(false);
        handleFirestoreError(err, OperationType.LIST, 'products');
      }
    );

    const unsubVariants = onSnapshot(
      query(collection(db, 'variants'), where('isActive', '==', true)),
      (snap) => {
        const list = snap.docs.map((d) => ({
          id: d.id,
          ...(d.data() as Omit<ProductVariant, 'id'>),
        }));
        setVariants(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'variants')
    );

    return () => {
      unsubConfig();
      unsubCategories();
      unsubProducts();
      unsubVariants();
    };
  }, []);

  // Admin full-catalog listener (includes draft and archived)
  useEffect(() => {
    if (!authReady || !isAdmin) {
      setAllProductsAdmin([]);
      return;
    }
    const unsubAll = onSnapshot(
      collection(db, 'products'),
      (snap) => {
        const list = snap.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Product, 'id'>) }));
        setAllProductsAdmin(list);
      },
      (err) => handleFirestoreError(err, OperationType.LIST, 'products')
    );
    return () => unsubAll();
  }, [authReady, isAdmin]);

  const initializeCatalog = useCallback(async () => {
    if (!user?.email || !isAdmin) {
      toast('Administrator authentication required to initialize catalog.', 'error');
      return false;
    }
    const res = await seedInitialCatalogClient(user.email);
    if (res.seeded) {
      toast('MIREZA initial catalog and New Drop 01 initialized.', 'success');
    } else {
      toast('Catalog is already populated.', 'default');
    }
    return res.seeded;
  }, [user, isAdmin, toast]);

  // Auto-seed or expand sample catalog once when bootstrapped admin loads
  useEffect(() => {
    if (!authReady || !isAdmin || loadingCatalog || !user?.email || syncedSampleRef.current) return;
    syncedSampleRef.current = true;
    const adminEmail = user.email;
    if (products.length === 0 && categories.length === 0) {
      seedInitialCatalogClient(adminEmail)
        .then((res) => {
          if (res.seeded) {
            toast('MIREZA catalog initialized in Firestore.', 'success');
          }
        })
        .catch(() => {});
    } else {
      ensureFullSampleCatalog(adminEmail)
        .then((res) => {
          if (res.addedProducts > 0) {
            toast(`Added ${res.addedProducts} fictional pieces across all collections.`, 'success');
          }
        })
        .catch(() => {
          ensureDefaultCategories(adminEmail).catch(() => {});
        });
    }
  }, [authReady, isAdmin, loadingCatalog, products.length, categories.length, user?.email, toast]);

  const effectiveCategories = useMemo(() => {
    if (!loadingCatalog && categories.length === 0) return fallbackCategories;
    return categories;
  }, [loadingCatalog, categories, fallbackCategories]);

  const effectiveProducts = useMemo(() => {
    if (!loadingCatalog && products.length === 0) return fallbackProducts;
    if (!loadingCatalog && products.length > 0) {
      const existingIds = new Set(products.map((p) => p.id));
      const missingSeeds = fallbackProducts.filter((fp) => !existingIds.has(fp.id));
      if (missingSeeds.length > 0) return [...products, ...missingSeeds];
    }
    return products;
  }, [loadingCatalog, products, fallbackProducts]);

  const effectiveVariants = useMemo(() => {
    if (!loadingCatalog && variants.length === 0 && products.length === 0) return fallbackVariants;
    if (!loadingCatalog && products.length > 0) {
      const existingProdIds = new Set(products.map((p) => p.id));
      const missingVars = fallbackVariants.filter((fv) => !existingProdIds.has(fv.productId));
      if (missingVars.length > 0) return [...variants, ...missingVars];
    }
    return variants;
  }, [loadingCatalog, variants, products, fallbackVariants]);

  const getProductVariants = useCallback(
    (productId: string) => effectiveVariants.filter((v) => v.productId === productId),
    [effectiveVariants]
  );

  const addToCart = useCallback(
    (item: CartItem, openDrawer = true) => {
      const targetVariant = variants.find((v) => v.id === item.variantId);
      const maxAvailable = targetVariant
        ? Math.max(0, targetVariant.stockQty - targetVariant.reservedQty)
        : 99;

      setCart((prev) => {
        const existing = prev.find((c) => c.variantId === item.variantId);
        if (existing) {
          const nextQty = item.isPreorder
            ? existing.quantity + item.quantity
            : Math.min(maxAvailable, existing.quantity + item.quantity);
          return prev.map((c) =>
            c.variantId === item.variantId ? { ...c, quantity: Math.max(1, nextQty) } : c
          );
        }
        return [...prev, item];
      });
      if (openDrawer) setCartOpen(true);
      toast(`${item.name} (${item.color} / ${item.size}) added to bag.`, 'success');
    },
    [variants, toast]
  );

  const updateCartQty = useCallback(
    (variantId: string, qty: number) => {
      if (qty <= 0) {
        setCart((prev) => prev.filter((c) => c.variantId !== variantId));
        return;
      }
      const targetVariant = variants.find((v) => v.id === variantId);
      const maxAvailable = targetVariant
        ? Math.max(1, targetVariant.stockQty - targetVariant.reservedQty)
        : qty;

      setCart((prev) =>
        prev.map((c) =>
          c.variantId === variantId
            ? { ...c, quantity: c.isPreorder ? qty : Math.min(maxAvailable, qty) }
            : c
        )
      );
    },
    [variants]
  );

  const removeFromCart = useCallback((variantId: string) => {
    setCart((prev) => prev.filter((c) => c.variantId !== variantId));
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const cartCount = useMemo(() => cart.reduce((sum, item) => sum + item.quantity, 0), [cart]);
  const cartSubtotalXof = useMemo(
    () => cart.reduce((sum, item) => sum + item.unitPriceXof * item.quantity, 0),
    [cart]
  );

  const catalogEmpty = !loadingCatalog && products.length === 0 && categories.length === 0;

  return (
    <StoreContext.Provider
      value={{
        route,
        navigate,
        categories: effectiveCategories,
        products: effectiveProducts,
        allProductsAdmin,
        variants: effectiveVariants,
        storefrontConfig,
        loadingCatalog,
        catalogEmpty,
        cart,
        cartOpen,
        setCartOpen,
        addToCart,
        updateCartQty,
        removeFromCart,
        clearCart,
        cartCount,
        cartSubtotalXof,
        getProductVariants,
        toast,
        initializeCatalog,
      }}
    >
      {children}
      {/* Subtle luxury toast stack */}
      {toasts.length > 0 && (
        <div
          aria-live="polite"
          className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm pointer-events-none"
        >
          {toasts.map((t) => (
            <div
              key={t.id}
              className={`pointer-events-auto px-4 py-3 text-xs tracking-wide border transition-all ${
                t.tone === 'error'
                  ? 'bg-black text-white border-black font-bold'
                  : 'bg-white text-black border-black font-light'
              }`}
            >
              {t.text}
            </div>
          ))}
        </div>
      )}
    </StoreContext.Provider>
  );
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used inside StoreProvider');
  return ctx;
}
