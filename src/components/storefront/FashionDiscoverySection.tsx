import React, { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { formatXOF, getColorHex } from '../../lib/format';
import { detectDominantColorsFromImageUrl, DetectedColor } from '../../lib/colorDetector';

interface RunwayLook {
  id: string;
  productSlug: string;
  fallbackName: string;
  fallbackPriceXof: number;
  fallbackDescription: string;
  modelImageUrl: string;
  fallbackHex: string;
}

const RUNWAY_LOOKS: RunwayLook[] = [
  {
    id: 'look_bresil_bikini',
    productSlug: 'bresil-bikini',
    fallbackName: 'Brésil Bikini',
    fallbackPriceXof: 25000,
    fallbackDescription:
      'Bikini emblématique vert émeraude à bordures jaune soleil, pensé pour une allure solaire et sculptante.',
    modelImageUrl: '/assets/mireza/runway_bresil_bikini.jpg',
    fallbackHex: '#0E6B47',
  },
  {
    id: 'look_bahamas_jersey',
    productSlug: 'bahamas-jersey',
    fallbackName: 'Bahamas JERSEY',
    fallbackPriceXof: 35000,
    fallbackDescription:
      'Jersey mixte oversize en maille respirante noir et jaune MIREZA 19, inspiré des îles caribéennes.',
    modelImageUrl: '/assets/mireza/runway_bahamas_jersey.jpg',
    fallbackHex: '#181818',
  },
  {
    id: 'look_saint_lucia_set',
    productSlug: 'bahamas-t-shirt-copie-1',
    fallbackName: 'Saint Lucia FULL SET',
    fallbackPriceXof: 32000,
    fallbackDescription:
      'Ensemble coordonné baby tee raglan bleu ciel & jaune accompagné de son short cordon assorti.',
    modelImageUrl: '/assets/mireza/runway_saint_lucia_set.jpg',
    fallbackHex: '#0095D9',
  },
  {
    id: 'look_jamaica_jersey',
    productSlug: 'jamaica-jersey',
    fallbackName: 'Jamaïca JERSEY',
    fallbackPriceXof: 35000,
    fallbackDescription:
      'Maillot oversize en maille technique vert tropical et jaune soleil MIREZA 19.',
    modelImageUrl: '/assets/mireza/runway_jamaica_jersey.jpg',
    fallbackHex: '#1D7A46',
  },
  {
    id: 'look_ivoire_jersey',
    productSlug: 'cote-d-ivoire-jersey',
    fallbackName: 'Côte d’Ivoire JERSEY',
    fallbackPriceXof: 35000,
    fallbackDescription:
      'Jersey mixte oversize blanc, vert et orange 225, taillé pour conjuguer confort et identité.',
    modelImageUrl: '/assets/mireza/runway_ivoire_jersey.jpg',
    fallbackHex: '#F26A1B',
  },
];

function getCircularOffset(index: number, active: number, total: number): number {
  let diff = index - active;
  if (diff > total / 2) diff -= total;
  if (diff < -total / 2) diff += total;
  return diff;
}

export function FashionDiscoverySection() {
  const { products, getProductVariants, navigate } = useStore();
  const shouldReduceMotion = useReducedMotion();
  const [activeIdx, setActiveIdx] = useState(0);
  const [detectedColorsMap, setDetectedColorsMap] = useState<Record<string, DetectedColor[]>>({});
  const [selectedSwatchHex, setSelectedSwatchHex] = useState<string>('');

  const total = RUNWAY_LOOKS.length;
  const activeLook = RUNWAY_LOOKS[activeIdx];

  const linkedProduct = useMemo(
    () => products.find((p) => p.slug === activeLook.productSlug) || null,
    [products, activeLook.productSlug]
  );

  const linkedVariants = useMemo(
    () => (linkedProduct ? getProductVariants(linkedProduct.id).filter((v) => v.isActive) : []),
    [linkedProduct, getProductVariants]
  );

  // Detect authentic garment colors automatically for each linked product
  useEffect(() => {
    let cancelled = false;
    const imgUrl = linkedProduct?.images?.[0] || activeLook.modelImageUrl;
    if (!imgUrl || detectedColorsMap[activeLook.id]) return;

    detectDominantColorsFromImageUrl(imgUrl, 3).then((cols) => {
      if (!cancelled && cols.length > 0) {
        setDetectedColorsMap((prev) => ({ ...prev, [activeLook.id]: cols }));
      }
    });
    return () => {
      cancelled = true;
    };
  }, [activeLook.id, activeLook.modelImageUrl, linkedProduct, detectedColorsMap]);

  const displaySwatches = useMemo(() => {
    const variantMap = new Map<string, string>();
    for (const v of linkedVariants) {
      if (v.color && v.color !== 'Edition 01' && !variantMap.has(v.color)) {
        variantMap.set(v.color, v.colorHex || getColorHex(v.color));
      }
    }
    if (variantMap.size > 0) {
      return Array.from(variantMap.entries()).map(([name, hex]) => ({ name, hex }));
    }
    const detected = detectedColorsMap[activeLook.id];
    if (detected && detected.length > 0) {
      return detected;
    }
    return [{ name: activeLook.fallbackName, hex: activeLook.fallbackHex }];
  }, [linkedVariants, detectedColorsMap, activeLook]);

  useEffect(() => {
    if (displaySwatches.length > 0) {
      setSelectedSwatchHex(displaySwatches[0].hex);
    }
  }, [activeIdx, displaySwatches]);

  const goPrev = () => setActiveIdx((prev) => (prev - 1 + total) % total);
  const goNext = () => setActiveIdx((prev) => (prev + 1) % total);

  const displayTitle = linkedProduct?.name || activeLook.fallbackName;
  const displayDescription = linkedProduct?.description || activeLook.fallbackDescription;
  const displayPrice =
    linkedProduct &&
    typeof linkedProduct.promoPriceXof === 'number' &&
    linkedProduct.promoPriceXof > 0 &&
    linkedProduct.promoPriceXof < linkedProduct.regularPriceXof
      ? linkedProduct.promoPriceXof
      : linkedProduct?.regularPriceXof || activeLook.fallbackPriceXof;

  const compareAt =
    linkedProduct &&
    typeof linkedProduct.promoPriceXof === 'number' &&
    linkedProduct.promoPriceXof > 0 &&
    linkedProduct.promoPriceXof < linkedProduct.regularPriceXof
      ? linkedProduct.regularPriceXof
      : null;

  const targetHref = linkedProduct ? `/product/${linkedProduct.slug}` : `/product/${activeLook.productSlug}`;

  return (
    <section
      aria-label="MIREZA Runway Showcase"
      className="relative w-full bg-white text-black overflow-hidden min-h-[680px] sm:min-h-[740px] lg:min-h-[820px] flex flex-col justify-between select-none"
    >
      {/* Subtle Pure-White Sculptural Studio Architecture Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <svg
          viewBox="0 0 1440 820"
          preserveAspectRatio="xMidYMid slice"
          className="w-full h-full"
        >
          <defs>
            <radialGradient id="mirezaWhiteFloor" cx="50%" cy="84%" r="52%">
              <stop offset="0%" stopColor="#F1F1F1" stopOpacity="0.95" />
              <stop offset="55%" stopColor="#FAFAFA" stopOpacity="0.5" />
              <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="mirezaArchStroke" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#EAEAEA" stopOpacity="0.85" />
              <stop offset="50%" stopColor="#F5F5F5" stopOpacity="0.45" />
              <stop offset="100%" stopColor="#E6E6E6" stopOpacity="0.75" />
            </linearGradient>
          </defs>
          <rect width="1440" height="820" fill="#FFFFFF" />
          {/* Concentric Sculptural White Studio Arches */}
          <circle cx="720" cy="490" r="320" fill="none" stroke="url(#mirezaArchStroke)" strokeWidth="2" />
          <circle cx="720" cy="490" r="460" fill="none" stroke="url(#mirezaArchStroke)" strokeWidth="2.5" />
          <circle cx="720" cy="490" r="610" fill="none" stroke="url(#mirezaArchStroke)" strokeWidth="3" />
          <circle cx="720" cy="490" r="780" fill="none" stroke="url(#mirezaArchStroke)" strokeWidth="2" />
          {/* Soft White Runway Stage Floor Disc */}
          <ellipse cx="720" cy="705" rx="640" ry="130" fill="url(#mirezaWhiteFloor)" />
        </svg>
      </div>

      {/* 3D Perspective 5-Mannequin Runway Stage */}
      <div className="relative z-10 flex-1 w-full min-h-[520px] sm:min-h-[620px] lg:min-h-[700px] flex items-end justify-center pt-10 pb-24 sm:pb-20">
        {RUNWAY_LOOKS.map((look, idx) => {
          const offset = getCircularOffset(idx, activeIdx, total);
          const isCenter = offset === 0;
          const absOffset = Math.abs(offset);

          // 3D Arc Positioning matching the reference runway composition
          const xPercent =
            offset === 0
              ? '0%'
              : offset === -1
                ? '-82%'
                : offset === 1
                  ? '82%'
                  : offset === -2
                    ? '-146%'
                    : '146%';

          const yPercent =
            offset === 0 ? '0%' : absOffset === 1 ? '-7%' : '-14%';

          const scale = offset === 0 ? 1 : absOffset === 1 ? 0.68 : 0.46;
          const opacity = offset === 0 ? 1 : absOffset === 1 ? 0.94 : 0.78;
          const zIndex = offset === 0 ? 30 : absOffset === 1 ? 20 : 10;

          return (
            <motion.button
              key={look.id}
              type="button"
              onClick={() => {
                if (isCenter) {
                  navigate(targetHref);
                } else {
                  setActiveIdx(idx);
                }
              }}
              aria-label={isCenter ? `Voir ${displayTitle}` : `Afficher ${look.fallbackName}`}
              initial={false}
              animate={{
                x: xPercent,
                y: yPercent,
                scale,
                opacity,
              }}
              transition={
                shouldReduceMotion
                  ? { duration: 0.15 }
                  : { type: 'spring', stiffness: 210, damping: 26, mass: 0.9 }
              }
              style={{ zIndex }}
              className={`absolute bottom-14 sm:bottom-10 h-[390px] sm:h-[520px] lg:h-[630px] aspect-[3/4] flex items-end justify-center focus:outline-none cursor-pointer ${
                absOffset === 2 ? 'hidden md:flex' : 'flex'
              }`}
            >
              <img
                src={look.modelImageUrl}
                alt={look.fallbackName}
                referrerPolicy="no-referrer"
                draggable={false}
                className="w-full h-full object-contain object-bottom mix-blend-multiply pointer-events-none"
              />
            </motion.button>
          );
        })}

        {/* Left & Right Circular Carousel Arrows (matching reference image) */}
        <button
          type="button"
          onClick={goPrev}
          aria-label="Mannequin précédent"
          className="absolute left-4 sm:left-8 lg:left-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/[0.04] backdrop-blur-sm border border-black/10 text-black inline-flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" strokeWidth={1.6} />
        </button>

        <button
          type="button"
          onClick={goNext}
          aria-label="Mannequin suivant"
          className="absolute right-4 sm:right-8 lg:right-12 top-1/2 -translate-y-1/2 z-40 w-11 h-11 rounded-full bg-black/[0.04] backdrop-blur-sm border border-black/10 text-black inline-flex items-center justify-center hover:bg-black hover:text-white transition-colors cursor-pointer"
        >
          <ArrowRight className="w-4 h-4" strokeWidth={1.6} />
        </button>
      </div>

      {/* Bottom Interactive Overlay Row: Left (Product Details) | Center (Counter & Line) | Right (Color Selector + Thumbnail Dock) */}
      <div className="relative lg:absolute lg:inset-x-0 lg:bottom-0 z-40 px-5 sm:px-8 lg:px-12 pb-8 pt-2 flex flex-col lg:flex-row lg:items-end justify-between gap-6 pointer-events-none">
        {/* LEFT: Linked Product Detail Module (same purity as Product Detail Page) */}
        <div className="pointer-events-auto max-w-[300px] sm:max-w-[340px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLook.id}
              initial={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={shouldReduceMotion ? { opacity: 1 } : { opacity: 0, y: -8 }}
              transition={{ duration: 0.22 }}
              className="space-y-2.5"
            >
              <h2 className="font-editorial text-2xl sm:text-3xl lg:text-[34px] text-black leading-[1.06] tracking-[-0.01em] uppercase">
                {displayTitle}
              </h2>

              <div className="flex items-baseline gap-2.5 tabular-nums">
                <span className="text-base sm:text-lg font-bold text-black">
                  {formatXOF(displayPrice)}
                </span>
                {compareAt && compareAt > displayPrice && (
                  <span className="text-xs font-light text-black/45 line-through">
                    {formatXOF(compareAt)}
                  </span>
                )}
              </div>

              <p className="text-xs font-light text-black/65 line-clamp-2 leading-relaxed">
                {displayDescription}
              </p>

              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate(targetHref)}
                  className="px-6 py-2.5 rounded-full bg-black text-white text-[11px] font-bold tracking-[0.06em] inline-flex items-center gap-2.5 hover:bg-black/85 transition-colors cursor-pointer"
                >
                  <span>Découvrir le produit</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* CENTER: Minimal Slide Counter + Hairline Progress Bar */}
        <div className="pointer-events-auto flex items-center gap-3 self-start lg:self-end lg:mb-2">
          <span className="text-xs font-medium text-black tabular-nums tracking-wider">
            {String(activeIdx + 1).padStart(2, '0')}
            <span className="text-black/35"> / {String(total).padStart(2, '0')}</span>
          </span>
          <div className="relative w-24 sm:w-28 h-[1.5px] bg-black/15 overflow-hidden">
            <motion.div
              className="absolute inset-y-0 left-0 bg-black"
              initial={false}
              animate={{ width: `${((activeIdx + 1) / total) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>

        {/* RIGHT: Minimal Color Selector Circles + Rounded Mannequin Thumbnail Dock */}
        <div className="pointer-events-auto flex flex-col items-start lg:items-end gap-3.5">
          {/* Pure Color Selector Circles (no title, no color text) */}
          {displaySwatches.length > 0 && (
            <div className="flex items-center gap-2.5 px-1">
              {displaySwatches.map((swatch) => {
                const isSelected = selectedSwatchHex === swatch.hex;
                return (
                  <button
                    key={`${swatch.name}_${swatch.hex}`}
                    type="button"
                    title={swatch.name}
                    aria-label={swatch.name}
                    onClick={() => setSelectedSwatchHex(swatch.hex)}
                    className={`w-6 h-6 rounded-full border border-black/15 transition-all cursor-pointer ${
                      isSelected
                        ? 'ring-2 ring-black ring-offset-2 ring-offset-white scale-105'
                        : 'opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: swatch.hex }}
                  />
                );
              })}
            </div>
          )}

          {/* Rounded Frosted Capsule Thumbnail Switcher (matching reference bottom-right dock) */}
          <div className="rounded-full bg-black/[0.04] backdrop-blur-md border border-black/[0.08] p-1.5 flex items-center gap-1.5">
            {RUNWAY_LOOKS.map((look, idx) => {
              const isSelected = idx === activeIdx;
              return (
                <button
                  key={look.id}
                  type="button"
                  onClick={() => setActiveIdx(idx)}
                  aria-label={`Afficher ${look.fallbackName}`}
                  className={`relative w-10 h-10 sm:w-11 sm:h-11 rounded-full overflow-hidden bg-white transition-all cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-black scale-105 opacity-100'
                      : 'opacity-65 hover:opacity-100'
                  }`}
                >
                  <img
                    src={look.modelImageUrl}
                    alt={look.fallbackName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
