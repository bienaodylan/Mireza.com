import React, { useMemo, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from '../components/storefront/ProductCard';
import { formatXOF, getProductAvailability } from '../lib/format';
import { INITIAL_CATEGORIES } from '../lib/catalogDefaults';

interface CatalogPageProps {
  mode: 'all' | 'new-drop' | 'category';
  categorySlug?: string;
}

type SortOption = 'newest' | 'price-asc' | 'price-desc' | 'recent';

export function CatalogPage({ mode, categorySlug }: CatalogPageProps) {
  const { products, categories, variants, getProductVariants, loadingCatalog, navigate } =
    useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedSize, setSelectedSize] = useState<string>('all');
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [availabilityFilter, setAvailabilityFilter] = useState<string>('all');
  const [maxPriceXof, setMaxPriceXof] = useState<number>(150000);
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [filtersOpen, setFiltersOpen] = useState(false);

  const visibleCategories = useMemo(
    () => categories.filter((c) => c.slug !== 'sweat-wear'),
    [categories]
  );

  const activeCategoryObj = useMemo(() => {
    if (mode === 'category' && categorySlug) {
      const match =
        visibleCategories.find(
          (c) =>
            c.slug === categorySlug ||
            (categorySlug === 'jersey' && c.slug === 'jerseys') ||
            (categorySlug === 'jerseys' && c.slug === 'jersey') ||
            ((categorySlug === 'bikini' || categorySlug === 'swimwear') &&
              (c.id === 'cat_swimwear' || c.slug === 'bikini' || c.slug === 'swimwear'))
        ) ||
        INITIAL_CATEGORIES.find(
          (c) =>
            c.slug === categorySlug ||
            (categorySlug === 'jersey' && c.slug === 'jerseys') ||
            (categorySlug === 'jerseys' && c.slug === 'jersey') ||
            ((categorySlug === 'bikini' || categorySlug === 'swimwear') &&
              (c.id === 'cat_swimwear' || c.slug === 'bikini' || c.slug === 'swimwear'))
        );
      return match || null;
    }
    return null;
  }, [mode, categorySlug, visibleCategories]);

  const allSizes = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v) => v.size && set.add(v.size));
    return Array.from(set);
  }, [variants]);

  const allColors = useMemo(() => {
    const set = new Set<string>();
    variants.forEach((v) => v.color && set.add(v.color));
    return Array.from(set);
  }, [variants]);

  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      if (mode === 'new-drop' && !p.isNewDrop) return false;
      if (mode === 'category' && activeCategoryObj && p.categoryId !== activeCategoryObj.id) {
        return false;
      }
      if (mode !== 'category' && selectedCategory !== 'all' && p.categoryId !== selectedCategory) {
        return false;
      }

      const pVariants = getProductVariants(p.id);
      const effectivePrice =
        typeof p.promoPriceXof === 'number' && p.promoPriceXof > 0
          ? p.promoPriceXof
          : p.regularPriceXof;

      if (effectivePrice > maxPriceXof) return false;

      if (selectedSize !== 'all') {
        const hasSize = pVariants.some((v) => v.size === selectedSize && v.isActive);
        if (!hasSize) return false;
      }

      if (selectedColor !== 'all') {
        const hasColor = pVariants.some((v) => v.color === selectedColor && v.isActive);
        if (!hasColor) return false;
      }

      if (availabilityFilter !== 'all') {
        const state = getProductAvailability(p, pVariants);
        if (availabilityFilter === 'in_stock' && state.isSoldOut) return false;
        if (availabilityFilter === 'low_stock' && state.primaryState !== 'LOW STOCK') return false;
        if (availabilityFilter === 'sale' && !state.isOnSale) return false;
        if (availabilityFilter === 'preorder' && !p.isPreorder) return false;
      }

      return true;
    });

    return [...list].sort((a, b) => {
      const priceA =
        typeof a.promoPriceXof === 'number' && a.promoPriceXof > 0
          ? a.promoPriceXof
          : a.regularPriceXof;
      const priceB =
        typeof b.promoPriceXof === 'number' && b.promoPriceXof > 0
          ? b.promoPriceXof
          : b.regularPriceXof;

      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'recent') {
        const tA = a.createdAt?.toMillis?.() || 0;
        const tB = b.createdAt?.toMillis?.() || 0;
        return tB - tA;
      }
      const orderDiff = (a.newDropOrder || 999) - (b.newDropOrder || 999);
      if (orderDiff !== 0) return orderDiff;
      return (a.sku || '').localeCompare(b.sku || '');
    });
  }, [
    products,
    mode,
    activeCategoryObj,
    selectedCategory,
    maxPriceXof,
    selectedSize,
    selectedColor,
    availabilityFilter,
    sortBy,
    getProductVariants,
  ]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedSize('all');
    setSelectedColor('all');
    setAvailabilityFilter('all');
    setMaxPriceXof(150000);
    setSortBy('newest');
  };

  const title =
    mode === 'new-drop'
      ? 'New Drop 01'
      : activeCategoryObj
        ? activeCategoryObj.name
        : 'View All';

  return (
    <main className="pt-20 pb-20 max-w-[1440px] mx-auto px-2 sm:px-4 md:px-6 min-h-screen">
      {/* Collection Title & Filter|Sort Trigger — Zero Border Lines */}
      <div className="pt-6 pb-3 px-1 flex items-center justify-between gap-4">
        <div className="flex items-start gap-1">
          <h1 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-black">
            {title}
          </h1>
          <sup className="text-[11px] font-bold text-[#D17493] tabular-nums mt-1.5">
            {filteredProducts.length}
          </sup>
        </div>

        <button
          type="button"
          onClick={() => setFiltersOpen(true)}
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.12em] text-black hover:text-[#D17493] transition-colors cursor-pointer"
        >
          <SlidersHorizontal className="w-3.5 h-3.5" />
          <span>Filter | Sort</span>
        </button>
      </div>

      {/* Horizontal Collection Tabs — Zero Border Lines */}
      <div className="px-1 pb-5 flex items-center gap-5 overflow-x-auto no-scrollbar text-xs">
        <button
          type="button"
          onClick={() => {
            setSelectedCategory('all');
            navigate('/shop');
          }}
          className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            mode === 'all' && selectedCategory === 'all'
              ? 'font-bold text-black'
              : 'font-light text-black/65 hover:text-black'
          }`}
        >
          View All
        </button>
        <button
          type="button"
          onClick={() => navigate('/new-drop')}
          className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
            mode === 'new-drop'
              ? 'font-bold text-black'
              : 'font-light text-black/65 hover:text-black'
          }`}
        >
          New Drop
        </button>
        {visibleCategories.map((cat) => {
          const isActive =
            (mode === 'category' && activeCategoryObj?.id === cat.id) ||
            (mode !== 'category' && selectedCategory === cat.id);
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => {
                setSelectedCategory('all');
                navigate(`/category/${cat.slug}`);
              }}
              className={`whitespace-nowrap shrink-0 cursor-pointer transition-colors ${
                isActive ? 'font-bold text-black' : 'font-light text-black/65 hover:text-black'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Full-Width 4-Column Tightly-Packed Grid */}
      {loadingCatalog ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-square bg-[#F7F7F7] animate-pulse" />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#F7F7F7] p-12 text-center space-y-4">
          <p className="font-editorial text-2xl text-black">
            No pieces match these filters
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.18em] cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-1">
          {filteredProducts.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              variants={getProductVariants(p.id)}
            />
          ))}
        </div>
      )}

      {/* Slide-Over Filter & Sort Drawer — Strictly Square, Zero Demarcation Lines */}
      {filtersOpen && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div
            className="fixed inset-0 bg-black/50"
            onClick={() => setFiltersOpen(false)}
          />
          <div className="relative w-80 max-w-[88vw] bg-white h-full p-6 overflow-y-auto space-y-7">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#D17493]">
                Filter &amp; Sort
              </span>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="min-h-[40px] min-w-[40px] flex items-center justify-center cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">Sort</p>
              <select
                aria-label="Sort products"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as SortOption)}
                className="w-full rounded-none bg-[#F7F7F7] px-3 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-black focus:outline-none"
              >
                <option value="newest">Newest</option>
                <option value="recent">Recently Added</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>

            {mode !== 'category' && (
              <div className="space-y-2.5">
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">
                  Category
                </p>
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    onClick={() => setSelectedCategory('all')}
                    className={`text-left text-xs py-1 cursor-pointer ${
                      selectedCategory === 'all' ? 'font-bold text-black' : 'font-light text-black/70'
                    }`}
                  >
                    All Categories
                  </button>
                  {visibleCategories.map((cat) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`text-left text-xs py-1 cursor-pointer ${
                        selectedCategory === cat.id
                          ? 'font-bold text-black'
                          : 'font-light text-black/70 hover:text-black'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">Size</p>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedSize('all')}
                  className={`px-3 py-1.5 rounded-none text-xs font-bold cursor-pointer ${
                    selectedSize === 'all'
                      ? 'bg-black text-white'
                      : 'bg-[#F7F7F7] text-black'
                  }`}
                >
                  All
                </button>
                {allSizes.map((sz) => (
                  <button
                    key={sz}
                    type="button"
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-1.5 rounded-none text-xs font-bold cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-black text-white'
                        : 'bg-[#F7F7F7] text-black'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">Color</p>
              <div className="flex flex-col gap-1.5">
                <button
                  type="button"
                  onClick={() => setSelectedColor('all')}
                  className={`text-left text-xs py-1 cursor-pointer ${
                    selectedColor === 'all' ? 'font-bold text-black' : 'font-light text-black/70'
                  }`}
                >
                  All Colors
                </button>
                {allColors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColor(c)}
                    className={`text-left text-xs py-1 cursor-pointer ${
                      selectedColor === c
                        ? 'font-bold text-black'
                        : 'font-light text-black/70 hover:text-black'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">
                Availability
              </p>
              <div className="flex flex-col gap-1.5 text-xs">
                {[
                  { id: 'all', label: 'All Pieces' },
                  { id: 'in_stock', label: 'In Stock Only' },
                  { id: 'low_stock', label: 'Low Stock' },
                  { id: 'sale', label: 'On Sale' },
                  { id: 'preorder', label: 'Pre-Order' },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => setAvailabilityFilter(opt.id)}
                    className={`text-left py-1 cursor-pointer ${
                      availabilityFilter === opt.id
                        ? 'font-bold text-black'
                        : 'font-light text-black/70 hover:text-black'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold uppercase tracking-[0.2em] text-black/60">
                <span>Max Price</span>
                <span className="tabular-nums text-black">{formatXOF(maxPriceXof)}</span>
              </div>
              <input
                type="range"
                min={10000}
                max={150000}
                step={2500}
                value={maxPriceXof}
                onChange={(e) => setMaxPriceXof(Number(e.target.value))}
                className="w-full accent-black"
              />
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={resetFilters}
                className="flex-1 py-2.5 rounded-none bg-[#F7F7F7] text-xs font-bold uppercase tracking-[0.14em] text-black cursor-pointer"
              >
                Reset
              </button>
              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="flex-1 py-2.5 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.14em] cursor-pointer"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
