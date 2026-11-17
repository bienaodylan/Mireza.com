import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatXOF, getAvailableStock, getColorHex, getProductAvailability } from '../lib/format';
import { ProductCard } from '../components/storefront/ProductCard';
import { detectDominantColorsFromImageUrl, DetectedColor } from '../lib/colorDetector';

export function ProductDetailPage({ slug }: { slug: string }) {
  const { products, getProductVariants, addToCart, navigate } = useStore();

  const product = useMemo(
    () => products.find((p) => p.slug === slug) || null,
    [products, slug]
  );

  const variants = useMemo(
    () => (product ? getProductVariants(product.id).filter((v) => v.isActive) : []),
    [product, getProductVariants]
  );

  const [selectedColor, setSelectedColor] = useState<string>('');
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [qty, setQty] = useState(1);
  const [detectedDominantColor, setDetectedDominantColor] = useState<DetectedColor | null>(null);

  const imageRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    if (variants.length > 0) {
      const firstAvail = variants.find((v) => getAvailableStock(v) > 0) || variants[0];
      setSelectedColor(firstAvail.color);
      setSelectedSize(firstAvail.size);
      setQty(1);
      setActiveImageIdx(0);
    }
  }, [product?.id, variants]);

  // Identify dominant garment color silently as a fallback when product still uses generic Edition 01
  useEffect(() => {
    let cancelled = false;
    const targetUrl = product?.images?.[0] || '';
    if (!targetUrl) {
      setDetectedDominantColor(null);
      return;
    }
    detectDominantColorsFromImageUrl(targetUrl, 1).then((found) => {
      if (!cancelled) {
        setDetectedDominantColor(found[0] || null);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [product?.id, product?.images]);

  // Sync active thumbnail when scrolling through the middle image stack
  useEffect(() => {
    if (!product?.images || product.images.length <= 1) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idxAttr = entry.target.getAttribute('data-img-index');
            if (idxAttr !== null) {
              setActiveImageIdx(Number(idxAttr));
            }
          }
        }
      },
      { rootMargin: '-35% 0px -45% 0px', threshold: 0.1 }
    );
    imageRefs.current.forEach((el) => {
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [product?.id, product?.images]);

  const scrollToImage = (idx: number) => {
    setActiveImageIdx(idx);
    const el = imageRefs.current[idx];
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  if (!product) {
    return (
      <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 md:px-8 min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4">
        <h1 className="font-editorial text-3xl text-black">Piece Not Found</h1>
        <p className="text-sm font-light text-black/70">
          This piece may have been unpublished or moved.
        </p>
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="px-6 py-3 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.18em] cursor-pointer"
        >
          Return to Catalog
        </button>
      </main>
    );
  }

  const images = product.images || [];

  const variantColors = Array.from(
    new Map(variants.map((v) => [v.color, v.colorHex || getColorHex(v.color)])).entries()
  ).map(([name, hex]) => ({ name, hex }));

  const hasCustomVariantColors =
    variantColors.length > 1 ||
    (variantColors.length === 1 && variantColors[0].name !== 'Edition 01');

  const displaySwatches = hasCustomVariantColors
    ? variantColors
    : detectedDominantColor
      ? [detectedDominantColor]
      : variantColors;

  const sizesForColor = variants.filter((v) => v.color === selectedColor);
  const activeVariant =
    variants.find((v) => v.color === selectedColor && v.size === selectedSize) ||
    sizesForColor[0] ||
    variants[0];

  const available = activeVariant ? getAvailableStock(activeVariant) : 0;
  const overallAvailability = getProductAvailability(product, variants);

  const variantStateLabel = (() => {
    if (product.isPreorder && available <= 0) return 'PRE-ORDER';
    if (!activeVariant || available <= 0) return 'SOLD OUT';
    if (available <= (activeVariant.lowStockThreshold ?? product.lowStockThreshold ?? 5)) {
      return `LOW STOCK — ONLY ${available} LEFT`;
    }
    return 'IN STOCK';
  })();

  const unitPrice = activeVariant?.priceXof || product.promoPriceXof || product.regularPriceXof;
  const compareAt =
    activeVariant?.compareAtPriceXof ||
    (product.promoPriceXof && product.promoPriceXof < product.regularPriceXof
      ? product.regularPriceXof
      : null);

  const canPurchase = Boolean(activeVariant && (product.isPreorder || available > 0));

  const activeColorLabel = hasCustomVariantColors
    ? selectedColor
    : detectedDominantColor?.name || selectedColor;

  const activeColorHex =
    displaySwatches.find((c) => c.name === activeColorLabel)?.hex ||
    getColorHex(activeColorLabel);

  const handleAdd = () => {
    if (!activeVariant || !canPurchase) return;
    addToCart({
      variantId: activeVariant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: activeVariant.sku,
      color: activeColorLabel || activeVariant.color,
      colorHex: activeColorHex,
      size: activeVariant.size,
      unitPriceXof: unitPrice,
      quantity: qty,
      imageUrl: images[activeImageIdx] || images[0] || '',
      isPreorder: product.isPreorder && available <= 0,
    });
  };

  const related = products
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .slice(0, 4);

  return (
    <main className="pt-20 pb-24 max-w-[1440px] mx-auto px-4 md:px-8">
      {/* Breadcrumb — zero demarcation lines */}
      <div className="py-4 mb-4 flex items-center gap-3 text-xs font-light text-black/60">
        <button
          type="button"
          onClick={() => navigate('/shop')}
          className="inline-flex items-center gap-1.5 font-bold hover:text-black cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Shop</span>
        </button>
        <span>/</span>
        <span className="font-bold text-[#D17493]">{product.categoryName}</span>
        <span>/</span>
        <span className="font-bold text-black">{product.name}</span>
      </div>

      {/* 3-Column Layout: Left (Vertical Previews + Title, XOF Price, Description) | Middle (Adaptive Images) | Right (Selectors, Add to Bag & Info) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(260px,0.9fr)_minmax(0,1.35fr)_minmax(280px,0.9fr)] xl:grid-cols-[minmax(300px,0.95fr)_minmax(0,1.35fr)_minmax(300px,0.95fr)] gap-5 md:gap-7 xl:gap-10 items-start">
        {/* LEFT COLUMN (Vertical Sticky Previews + Title, Price in XOF, Description) */}
        <div className="lg:sticky lg:top-24 self-start flex flex-col lg:flex-row gap-4 xl:gap-5 items-start order-2 lg:order-1">
          {images.length > 0 && (
            <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-16 shrink-0 overflow-x-auto lg:overflow-visible">
              {images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => scrollToImage(i)}
                  aria-label={`Afficher vue ${i + 1}`}
                  className={`w-16 lg:w-full shrink-0 rounded-none bg-[#F7F7F7] overflow-hidden transition-all cursor-pointer ${
                    activeImageIdx === i
                      ? 'ring-2 ring-black opacity-100'
                      : 'opacity-55 hover:opacity-100'
                  }`}
                >
                  <img
                    src={img}
                    alt={`${product.name} miniature ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className="w-full h-auto block"
                  />
                </button>
              ))}
            </div>
          )}

          <div className="flex-1 min-w-0 space-y-4">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#D17493]">
                <span>
                  {product.categoryName} &middot; {overallAvailability.primaryState}
                </span>
                {activeVariant && (
                  <span className="font-light text-black/60">{activeVariant.sku}</span>
                )}
              </div>

              <h1 className="font-editorial text-2xl xl:text-3xl text-black leading-tight">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-0.5 tabular-nums">
                <span className="text-lg xl:text-xl font-bold text-black">
                  {formatXOF(unitPrice)}
                </span>
                {compareAt && compareAt > unitPrice && (
                  <span className="text-sm font-light text-black/50 line-through">
                    {formatXOF(compareAt)}
                  </span>
                )}
              </div>
            </div>

            <p className="text-xs xl:text-sm font-light text-black/80 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>

        {/* MIDDLE COLUMN (Adaptive High-Resolution Images — zero frames, zero borders) */}
        <div className="space-y-3 order-1 lg:order-2 min-w-0">
          {images.length > 0 ? (
            images.map((img, i) => (
              <div
                key={i}
                ref={(el) => {
                  imageRefs.current[i] = el;
                }}
                data-img-index={i}
                className="w-full aspect-[4/5] bg-[#F7F7F7] rounded-none overflow-hidden"
              >
                <img
                  src={img}
                  alt={`${product.name} vue ${i + 1}`}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain block"
                />
              </div>
            ))
          ) : (
            <div className="w-full py-32 bg-[#F7F7F7] flex items-center justify-center text-sm font-bold text-[#E9B9C8]">
              MIREZA
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (Sticky Color Selector, Size, Qty, Add to Bag & Payment Info) */}
        <div className="lg:sticky lg:top-24 self-start flex flex-col space-y-7 order-3">
          {/* SHEIN-style Worn Garment Color Selector — Square Thumbnails */}
          {displaySwatches.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold uppercase tracking-[0.16em] text-[#D17493]">
                  Couleur
                </span>
                <span className="font-bold text-black">{activeColorLabel}</span>
              </div>
              <div className="flex items-start gap-2.5 flex-wrap">
                {displaySwatches.map((c, cIdx) => {
                  const selected = c.name === activeColorLabel;
                  const garmentThumb = images[cIdx] || images[0] || '';
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={`Couleur ${c.name}`}
                      onClick={() => {
                        if (hasCustomVariantColors) {
                          setSelectedColor(c.name);
                          if (displaySwatches.length > 1 && images.length > cIdx) {
                            scrollToImage(cIdx);
                          }
                          const match = variants.find(
                            (v) => v.color === c.name && v.size === selectedSize
                          );
                          if (!match) {
                            const firstForColor = variants.find((v) => v.color === c.name);
                            if (firstForColor) setSelectedSize(firstForColor.size);
                          }
                          setQty(1);
                        }
                      }}
                      className={`group flex flex-col items-center gap-1 rounded-none cursor-pointer transition-all ${
                        selected ? 'opacity-100' : 'opacity-75 hover:opacity-100'
                      }`}
                    >
                      <div
                        className={`w-14 bg-[#F7F7F7] rounded-none overflow-hidden ${
                          selected ? 'ring-2 ring-black ring-offset-2' : ''
                        }`}
                      >
                        {garmentThumb ? (
                          <img
                            src={garmentThumb}
                            alt={c.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-auto block"
                          />
                        ) : (
                          <div
                            className="w-14 h-14 rounded-none"
                            style={{ backgroundColor: c.hex }}
                          />
                        )}
                      </div>
                      <span
                        className={`text-[10px] max-w-[60px] truncate ${
                          selected ? 'font-bold text-black' : 'font-light text-black/65'
                        }`}
                      >
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Size Selector — Strictly Square */}
          <div className="space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase tracking-[0.16em] text-[#D17493]">Taille</span>
              <span className="text-[11px] font-bold uppercase tracking-[0.14em] text-black">
                {variantStateLabel}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {sizesForColor.map((v) => {
                const vAvail = getAvailableStock(v);
                const disabled = !product.isPreorder && vAvail <= 0;
                const active = activeVariant?.id === v.id;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={disabled}
                    onClick={() => {
                      setSelectedSize(v.size);
                      setQty(1);
                    }}
                    className={`py-2.5 rounded-none text-xs font-bold transition-colors ${
                      disabled
                        ? 'bg-black/[0.04] text-black/35 line-through cursor-not-allowed'
                        : active
                          ? 'bg-black text-white cursor-pointer'
                          : 'bg-[#F7F7F7] text-black hover:bg-black hover:text-white cursor-pointer'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>

          {product.isPreorder && product.preorderEstimateDate && (
            <div className="p-3.5 rounded-none bg-[#F7F7F7] text-xs font-light text-black">
              Pre-order allocation: estimated dispatch from{' '}
              <span className="font-bold">{product.preorderEstimateDate}</span>.
            </div>
          )}

          {/* Quantity & Add to Bag — Strictly Square */}
          <div className="flex items-stretch gap-2 pt-1">
            <div className="flex items-center rounded-none bg-[#F7F7F7] px-1">
              <button
                type="button"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="Decrease quantity"
                className="w-10 h-11 flex items-center justify-center hover:opacity-65 cursor-pointer"
              >
                <Minus className="w-3.5 h-3.5" />
              </button>
              <span className="w-8 text-center text-sm font-bold tabular-nums">{qty}</span>
              <button
                type="button"
                onClick={() =>
                  setQty((q) => (product.isPreorder ? q + 1 : Math.min(Math.max(1, available), q + 1)))
                }
                aria-label="Increase quantity"
                className="w-10 h-11 flex items-center justify-center hover:opacity-65 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
            </div>

            <button
              type="button"
              disabled={!canPurchase}
              onClick={handleAdd}
              className="flex-1 py-3.5 px-6 rounded-none bg-black text-white text-xs font-bold uppercase tracking-[0.2em] hover:bg-black/85 transition-colors disabled:bg-black/20 disabled:text-black/45 cursor-pointer disabled:cursor-not-allowed"
            >
              {canPurchase
                ? product.isPreorder && available <= 0
                  ? 'Pre-Order Piece'
                  : 'Add to Bag'
                : 'Sold Out'}
            </button>
          </div>

          {/* Payment & Delivery Info (Bottom Right — Zero Top Border) */}
          <div className="pt-3 space-y-2 text-xs font-light text-black/75">
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Real-time variant stock reservation during checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-3.5 h-3.5 text-black shrink-0" />
              <span>Wave, Orange Money, Mobile Money, Visa &amp; Mastercard accepted</span>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pieces — Zero Demarcation Line, Tight Grid */}
      {related.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D17493] mb-1">
            À Découvrir Aussi
          </p>
          <h2 className="font-editorial text-3xl text-black mb-6">Complementary Pieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-5 xl:gap-6">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} variants={getProductVariants(p.id)} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
