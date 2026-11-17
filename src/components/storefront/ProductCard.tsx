import React, { useState, useMemo, useEffect } from 'react';
import { Product, ProductVariant } from '../../types/commerce';
import { formatXOF, getAvailableStock, getColorHex, getProductAvailability } from '../../lib/format';
import { useStore } from '../../context/StoreContext';
import { detectDominantColorsFromImageUrl, DetectedColor } from '../../lib/colorDetector';

interface ProductCardProps {
  product: Product;
  variants: ProductVariant[];
}

export function ProductCard({ product, variants }: ProductCardProps) {
  const { navigate, addToCart } = useStore();
  const [selectedColor, setSelectedColor] = useState<string>(
    () => product.colors?.[0] || variants[0]?.color || ''
  );
  const [imgError, setImgError] = useState(false);
  const [dominantColor, setDominantColor] = useState<DetectedColor | null>(null);

  const availability = useMemo(
    () => getProductAvailability(product, variants),
    [product, variants]
  );

  const colorSwatches = useMemo(() => {
    const map = new Map<string, string>();
    for (const v of variants) {
      if (!map.has(v.color)) map.set(v.color, v.colorHex || getColorHex(v.color));
    }
    return Array.from(map.entries()).map(([name, hex]) => ({ name, hex }));
  }, [variants]);

  const hasCustomVariantColors =
    colorSwatches.length > 1 ||
    (colorSwatches.length === 1 && colorSwatches[0].name !== 'Edition 01');

  const variantsForColor = useMemo(
    () => variants.filter((v) => v.isActive && (!selectedColor || v.color === selectedColor)),
    [variants, selectedColor]
  );

  const displayPrice =
    typeof product.promoPriceXof === 'number' &&
    product.promoPriceXof > 0 &&
    product.promoPriceXof < product.regularPriceXof
      ? product.promoPriceXof
      : product.regularPriceXof;

  const handleQuickAdd = (variant: ProductVariant, e: React.MouseEvent) => {
    e.stopPropagation();
    addToCart({
      variantId: variant.id,
      productId: product.id,
      slug: product.slug,
      name: product.name,
      sku: variant.sku,
      color: variant.color,
      colorHex: variant.colorHex || getColorHex(variant.color),
      size: variant.size,
      unitPriceXof: variant.priceXof || displayPrice,
      quantity: 1,
      imageUrl: product.images?.[0] || '',
      isPreorder: product.isPreorder,
    });
  };

  const showBadge =
    availability.primaryState === 'NEW' ||
    availability.primaryState === 'SOLD OUT' ||
    availability.primaryState === 'PRE-ORDER';

  const selectedColorIndex = useMemo(() => {
    if (!selectedColor || colorSwatches.length <= 1) return 0;
    const idx = colorSwatches.findIndex((c) => c.name === selectedColor);
    return idx >= 0 ? idx : 0;
  }, [selectedColor, colorSwatches]);

  const primaryImage = useMemo(() => {
    const imgs = product.images || [];
    if (imgs.length === 0) return '';
    if (colorSwatches.length > 1 && imgs.length >= colorSwatches.length) {
      return imgs[selectedColorIndex] || imgs[0];
    }
    return imgs[0];
  }, [product.images, colorSwatches.length, selectedColorIndex]);

  const secondaryImage = useMemo(() => {
    const imgs = product.images || [];
    if (imgs.length <= 1) return '';
    if (colorSwatches.length > 1 && imgs.length >= colorSwatches.length) {
      const next = imgs[(selectedColorIndex + 1) % imgs.length];
      return next && next !== primaryImage ? next : '';
    }
    return imgs[1] && imgs[1] !== primaryImage ? imgs[1] : '';
  }, [product.images, colorSwatches.length, selectedColorIndex, primaryImage]);

  useEffect(() => {
    if (hasCustomVariantColors || !primaryImage) return;
    let cancelled = false;
    detectDominantColorsFromImageUrl(primaryImage, 1).then((cols) => {
      if (!cancelled && cols.length > 0) {
        setDominantColor(cols[0]);
      }
    });
    return () => {
      cancelled = true;
    };
  }, [hasCustomVariantColors, primaryImage]);

  const effectiveSwatches = hasCustomVariantColors
    ? colorSwatches
    : dominantColor
      ? [dominantColor]
      : colorSwatches;

  return (
    <article className="group flex flex-col">
      {/* Frameless Adaptive Media Surface */}
      <div
        onClick={() => navigate(`/product/${product.slug}`)}
        className="relative w-full bg-[#F7F7F7] rounded-none overflow-hidden cursor-pointer"
      >
        {primaryImage && !imgError ? (
          <>
            <img
              src={primaryImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className={`w-full h-auto block transition-all duration-500 ease-out ${
                secondaryImage
                  ? 'group-hover:opacity-0'
                  : 'group-hover:scale-[1.03]'
              }`}
            />
            {secondaryImage && (
              <img
                src={secondaryImage}
                alt={`${product.name} alternate view`}
                referrerPolicy="no-referrer"
                className="absolute inset-0 w-full h-full object-contain bg-[#F7F7F7] opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out"
              />
            )}
          </>
        ) : (
          <div className="w-full py-24 flex flex-col items-center justify-center bg-[#F7F7F7] text-black/60 p-4 text-center">
            <span className="font-bold text-lg tracking-[0.2em] uppercase text-[#E9B9C8]">
              MIREZA
            </span>
            <span className="text-[11px] font-light mt-1 text-black">{product.name}</span>
          </div>
        )}

        {/* Square corner badge */}
        {showBadge && (
          <div className="absolute top-2 left-2 z-10">
            <span className="px-2 py-0.5 rounded-none bg-black text-[#E9B9C8] text-[9px] font-bold uppercase tracking-[0.14em]">
              {availability.primaryState === 'NEW' ? 'NEW IN' : availability.primaryState}
            </span>
          </div>
        )}

        {/* Quick-Add Size Strip on hover (desktop) — Square & Frameless */}
        {!availability.isSoldOut && variantsForColor.length > 0 && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="hidden md:flex absolute inset-x-0 bottom-0 bg-white/95 px-2.5 py-2 items-center justify-between gap-1.5 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-200"
          >
            <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-[#D17493] shrink-0">
              Quick Add
            </span>
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {variantsForColor.map((v) => {
                const avail = getAvailableStock(v);
                const disabled = !product.isPreorder && avail <= 0;
                return (
                  <button
                    key={v.id}
                    type="button"
                    disabled={disabled}
                    onClick={(e) => handleQuickAdd(v, e)}
                    className={`px-2 py-0.5 rounded-none text-[10px] font-bold transition-colors ${
                      disabled
                        ? 'bg-black/[0.04] text-black/30 line-through cursor-not-allowed'
                        : 'bg-[#F7F7F7] text-black hover:bg-black hover:text-white cursor-pointer'
                    }`}
                  >
                    {v.size}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Minimal Typography & Square Color Indicators */}
      <div className="px-1.5 pt-2 pb-3 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => navigate(`/product/${product.slug}`)}
          className="text-left text-[11px] font-bold uppercase tracking-[0.06em] text-black leading-snug hover:opacity-65 transition-opacity cursor-pointer"
        >
          {product.name}
        </button>

        <div className="flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-2 text-[11px] tabular-nums">
            <span className="font-light text-black/85">{formatXOF(displayPrice)}</span>
            {availability.isOnSale && (
              <span className="text-[10px] font-light text-black/45 line-through">
                {formatXOF(product.regularPriceXof)}
              </span>
            )}
          </div>

          {effectiveSwatches.length > 0 && (
            <div className="flex items-center gap-1 shrink-0">
              {effectiveSwatches.map((swatch) => {
                const isSelected = hasCustomVariantColors && swatch.name === selectedColor;
                return (
                  <button
                    key={swatch.name}
                    type="button"
                    title={swatch.name}
                    aria-label={`Color ${swatch.name}`}
                    onClick={() => {
                      if (hasCustomVariantColors) setSelectedColor(swatch.name);
                      else navigate(`/product/${product.slug}`);
                    }}
                    className={`w-2.5 h-2.5 rounded-none transition-transform cursor-pointer ${
                      isSelected ? 'ring-1 ring-black ring-offset-1 ring-offset-white scale-110' : ''
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </article>
  );
}
