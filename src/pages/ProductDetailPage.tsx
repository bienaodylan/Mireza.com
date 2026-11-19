import React, { useMemo, useState, useEffect, useRef } from 'react';
import { ArrowLeft, Plus, Minus } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { formatXOF, getAvailableStock, getColorHex } from '../lib/format';
import { ProductCard } from '../components/storefront/ProductCard';
import {
  detectDominantColorsFromImageUrl,
  DetectedColor,
  analyzeProductImageBackground,
  ImageBackgroundAnalysis,
} from '../lib/colorDetector';

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
  const [imageBgMap, setImageBgMap] = useState<Record<string, ImageBackgroundAnalysis>>({});

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

  // Identify dominant garment color silently as a fallback when product uses generic Edition 01
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

  // Detect background type for every product image (transparent cutout / pure white vs real photo background)
  useEffect(() => {
    let cancelled = false;
    const imgs = product?.images || [];
    if (imgs.length === 0) {
      setImageBgMap({});
      return;
    }
    Promise.all(
      imgs.map(async (url) => ({
        url,
        analysis: await analyzeProductImageBackground(url),
      }))
    ).then((results) => {
      if (cancelled) return;
      const next: Record<string, ImageBackgroundAnalysis> = {};
      for (const item of results) {
        next[item.url] = item.analysis;
      }
      setImageBgMap(next);
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
      <main className="pt-32 pb-24 max-w-[1440px] mx-auto px-4 md:px-8 min-h-[70vh] flex flex-col items-center justify-center text-center space-y-4 bg-white">
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
    <main className="pt-16 pb-24 max-w-[1440px] mx-auto px-4 md:px-8 bg-white">
      {/* 3-Column Vertically Centered Layout: Left (Back/Breadcrumb + Previews + Title, XOF Price, Description) | Middle (Product Visuals) | Right (Color Circles, Sizes, Qty & Add to Bag) */}
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(280px,360px)_minmax(0,1fr)_minmax(280px,340px)] xl:grid-cols-[minmax(310px,390px)_minmax(0,1fr)_minmax(300px,360px)] gap-6 xl:gap-10 items-start">
        {/* LEFT COLUMN — Vertically Centered from Back/Breadcrumb down to Description */}
        <div className="lg:sticky lg:top-16 lg:min-h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center py-4 lg:py-8 order-2 lg:order-1">
          <div className="flex flex-col lg:flex-row gap-4 xl:gap-5 lg:items-center w-full">
            {images.length > 0 && (
              <div className="flex flex-row lg:flex-col gap-2 w-full lg:w-16 shrink-0 overflow-x-auto lg:overflow-visible">
                {images.map((img, i) => {
                  const bgInfo = imageBgMap[img];
                  const isCutout = bgInfo ? bgInfo.hasTransparentOrWhiteBg : false;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => scrollToImage(i)}
                      aria-label={`Afficher vue ${i + 1}`}
                      className={`w-16 lg:w-full aspect-[4/5] shrink-0 rounded-none bg-white overflow-hidden transition-all cursor-pointer ${
                        activeImageIdx === i
                          ? 'ring-2 ring-black opacity-100'
                          : 'opacity-55 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={img}
                        alt={`${product.name} miniature ${i + 1}`}
                        referrerPolicy="no-referrer"
                        className={`w-full h-full block ${
                          isCutout ? 'object-contain p-1 bg-white' : 'object-cover object-top'
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            )}

            <div className="flex-1 min-w-0 space-y-4">
              {/* Back + Category + Product Name Breadcrumb */}
              <div className="flex items-center flex-wrap gap-2 text-xs font-light text-black/60">
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

              <div className="space-y-2">
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
        </div>

        {/* MIDDLE COLUMN — Centered Product Visuals (Smart Background Detection) */}
        <div className="lg:min-h-[calc(100vh-4rem)] flex flex-col justify-center gap-3 py-4 lg:py-8 order-1 lg:order-2">
          {images.length > 0 ? (
            images.map((img, i) => {
              const bgInfo = imageBgMap[img];
              const isCutout = bgInfo ? bgInfo.hasTransparentOrWhiteBg : false;
              return (
                <div
                  key={i}
                  ref={(el) => {
                    imageRefs.current[i] = el;
                  }}
                  data-img-index={i}
                  className="w-full bg-white rounded-none overflow-hidden flex items-center justify-center"
                >
                  <img
                    src={img}
                    alt={`${product.name} vue ${i + 1}`}
                    referrerPolicy="no-referrer"
                    className={
                      isCutout
                        ? 'w-full max-h-[78vh] object-contain p-4 sm:p-8 bg-white block'
                        : 'w-full h-auto block'
                    }
                  />
                </div>
              );
            })
          ) : (
            <div className="w-full py-32 bg-white flex items-center justify-center text-sm font-bold text-[#E9B9C8]">
              MIREZA
            </div>
          )}
        </div>

        {/* RIGHT COLUMN — Vertically Centered Color Circles, Size Selector & Quantity/Add to Bag */}
        <div className="lg:sticky lg:top-16 lg:min-h-[calc(100vh-4rem)] lg:flex lg:flex-col lg:justify-center py-4 lg:py-8 order-3">
          <div className="space-y-6 w-full">
            {/* Pure Color Circles — No Title, No Color Name Text */}
            {displaySwatches.length > 0 && (
              <div className="flex items-center gap-3 flex-wrap">
                {displaySwatches.map((c, cIdx) => {
                  const selected = c.name === activeColorLabel;
                  return (
                    <button
                      key={c.name}
                      type="button"
                      title={c.name}
                      aria-label={c.name}
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
                      className={`w-7 h-7 rounded-full border border-black/15 transition-all cursor-pointer ${
                        selected
                          ? 'ring-2 ring-black ring-offset-2 ring-offset-white scale-105'
                          : 'opacity-80 hover:opacity-100'
                      }`}
                      style={{ backgroundColor: c.hex }}
                    />
                  );
                })}
              </div>
            )}

            {/* Pure Size Grid — No Title, No Stock Label */}
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
                          : 'bg-black/[0.05] text-black hover:bg-black hover:text-white cursor-pointer'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>

            {/* Quantity & Add to Bag — Strictly Square */}
            <div className="flex items-stretch gap-2 pt-1">
              <div className="flex items-center rounded-none bg-black/[0.05] px-1">
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
                    setQty((q) =>
                      product.isPreorder ? q + 1 : Math.min(Math.max(1, available), q + 1)
                    )
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
                {canPurchase ? 'Add to Bag' : 'Sold Out'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Related Pieces — Uniform Grid */}
      {related.length > 0 && (
        <section className="mt-20">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#D17493] mb-1">
            À Découvrir Aussi
          </p>
          <h2 className="font-editorial text-3xl text-black mb-6">Complementary Pieces</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 items-stretch">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} variants={getProductVariants(p.id)} />
            ))}
          </div>
        </section>
      )}
    </main>
  );
}
