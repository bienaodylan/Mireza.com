import React, { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { MIREZA_IMAGES } from '../../lib/catalogDefaults';

interface FashionSlide {
  id: string;
  genreId: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  href: string;
}

interface FashionGenreInfo {
  id: string;
  name: string;
  audience: string;
  summary: string;
  fit: string;
  universe: string;
  href: string;
  slideIndex: number;
}

const FASHION_SLIDES: FashionSlide[] = [
  {
    id: 'slide_jersey_1',
    genreId: 'jersey',
    title: 'Jersey Mixte',
    subtitle: 'Maille respirante & coupe oversize',
    imageUrl: MIREZA_IMAGES.lookbookJersey,
    href: '/category/jersey',
  },
  {
    id: 'slide_bikini_1',
    genreId: 'bikini',
    title: 'Bikini Resort',
    subtitle: 'Silhouettes solaires des îles',
    imageUrl: MIREZA_IMAGES.catSwimwear,
    href: '/category/bikini',
  },
  {
    id: 'slide_set_1',
    genreId: 'set',
    title: 'Full Set Paris',
    subtitle: 'Baby tee ringer & short cordon',
    imageUrl: MIREZA_IMAGES.lookbookParis,
    href: '/category/set',
  },
  {
    id: 'slide_acc_1',
    genreId: 'accessories',
    title: 'Casquettes & Tapis',
    subtitle: 'Nouvelle Collection Atelier',
    imageUrl: MIREZA_IMAGES.nextDropBanner,
    href: '/collection/casquettes-tapis',
  },
  {
    id: 'slide_crew_1',
    genreId: 'jersey',
    title: 'Caribbean Crew',
    subtitle: 'Allure urbaine & identité créole',
    imageUrl: MIREZA_IMAGES.lookbookCrew,
    href: '/collection/nouvelle-collection',
  },
  {
    id: 'slide_bikini_2',
    genreId: 'bikini',
    title: 'Édition Soleil',
    subtitle: 'Coupes échancrées & tons tropicaux',
    imageUrl: MIREZA_IMAGES.lookbookBikini2,
    href: '/category/bikini',
  },
];

const FASHION_GENRES: FashionGenreInfo[] = [
  {
    id: 'jersey',
    name: 'Jersey',
    audience: 'Mixte · Unisexe',
    summary: 'Maillots oversize inspirés des îles caribéennes et d’Afrique de l’Ouest, pensés pour la ville comme pour la côte.',
    fit: 'Coupe ample structurée',
    universe: 'Streetwear & Sport',
    href: '/category/jersey',
    slideIndex: 0,
  },
  {
    id: 'bikini',
    name: 'Bikini',
    audience: 'Femme · Swimwear',
    summary: 'Ensembles deux-pièces aux finitions nettes et maintien sculptant, dessinés pour la plage et le resort.',
    fit: 'Ajusté & galbant',
    universe: 'Plage & Resort',
    href: '/category/bikini',
    slideIndex: 1,
  },
  {
    id: 'set',
    name: 'Set',
    audience: 'Femme · Coordonné',
    summary: 'Duos assortis crop baby tee et short à cordon, conçus pour passer naturellement du matin au soir.',
    fit: 'Silhouette près du corps',
    universe: 'Quotidien & Voyage',
    href: '/category/set',
    slideIndex: 2,
  },
  {
    id: 'accessories',
    name: 'Casquettes & Tapis',
    audience: 'Mixte & Maison',
    summary: 'Nouvelle collection d’accessoires signature mêlant casquettes brodées multi-coloris et tapis tuftés.',
    fit: 'Taille unique & Décor',
    universe: 'Nouvelle Collection',
    href: '/collection/casquettes-tapis',
    slideIndex: 3,
  },
];

export function FashionDiscoverySection() {
  const { navigate } = useStore();
  const railRef = useRef<HTMLDivElement | null>(null);
  const [activeSlideIdx, setActiveSlideIdx] = useState(0);
  const [activeGenreId, setActiveGenreId] = useState<string>('jersey');

  const scrollToSlide = (index: number) => {
    const clamped = Math.max(0, Math.min(FASHION_SLIDES.length - 1, index));
    setActiveSlideIdx(clamped);
    setActiveGenreId(FASHION_SLIDES[clamped].genreId);
    const rail = railRef.current;
    if (!rail) return;
    const card = rail.children[clamped] as HTMLElement | undefined;
    if (card) {
      rail.scrollTo({
        left: card.offsetLeft,
        behavior: 'smooth',
      });
    }
  };

  const handleRailScroll = () => {
    const rail = railRef.current;
    if (!rail || rail.children.length === 0) return;
    const scrollLeft = rail.scrollLeft;
    let closest = 0;
    let bestDist = Infinity;
    for (let i = 0; i < rail.children.length; i++) {
      const child = rail.children[i] as HTMLElement;
      const dist = Math.abs(child.offsetLeft - scrollLeft);
      if (dist < bestDist) {
        bestDist = dist;
        closest = i;
      }
    }
    if (closest !== activeSlideIdx) {
      setActiveSlideIdx(closest);
      setActiveGenreId(FASHION_SLIDES[closest].genreId);
    }
  };

  const handleSelectGenre = (genre: FashionGenreInfo) => {
    setActiveGenreId(genre.id);
    scrollToSlide(genre.slideIndex);
  };

  return (
    <section className="w-full bg-white text-black">
      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.7fr)] gap-0 items-stretch">
        {/* LEFT: Interactive Horizontal Scrolling Fashion Discovery Rail */}
        <div className="relative bg-black flex flex-col justify-between overflow-hidden">
          {/* Top Minimal Controls Overlay */}
          <div className="flex items-center justify-between px-5 sm:px-8 pt-6 pb-4 text-white">
            <div className="flex items-center gap-3">
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                Découverte Fashion
              </span>
              <span className="text-[11px] font-light text-white/50 tabular-nums">
                {String(activeSlideIdx + 1).padStart(2, '0')} / {String(FASHION_SLIDES.length).padStart(2, '0')}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => scrollToSlide(activeSlideIdx - 1)}
                disabled={activeSlideIdx === 0}
                aria-label="Look précédent"
                className="w-9 h-9 rounded-full border border-white/25 text-white inline-flex items-center justify-center hover:bg-white hover:text-black transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scrollToSlide(activeSlideIdx + 1)}
                disabled={activeSlideIdx === FASHION_SLIDES.length - 1}
                aria-label="Look suivant"
                className="w-9 h-9 rounded-full border border-white/25 text-white inline-flex items-center justify-center hover:bg-white hover:text-black transition-colors disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Horizontal Snap-Scrolling Lookbook Cards */}
          <div
            ref={railRef}
            onScroll={handleRailScroll}
            className="flex gap-2 px-5 sm:px-8 pb-6 overflow-x-auto snap-x snap-mandatory no-scrollbar scroll-smooth"
          >
            {FASHION_SLIDES.map((slide, idx) => {
              const isActive = idx === activeSlideIdx;
              return (
                <div
                  key={slide.id}
                  onClick={() => {
                    if (isActive) {
                      navigate(slide.href);
                    } else {
                      scrollToSlide(idx);
                    }
                  }}
                  className="group relative snap-start shrink-0 w-[78vw] sm:w-[46vw] lg:w-[340px] xl:w-[380px] aspect-[3/4] overflow-hidden bg-black cursor-pointer"
                >
                  <img
                    src={slide.imageUrl}
                    alt={slide.title}
                    referrerPolicy="no-referrer"
                    className={`w-full h-full object-cover object-top transition-transform duration-700 ${
                      isActive ? 'scale-[1.01] group-hover:scale-[1.04]' : 'opacity-80 group-hover:opacity-100'
                    }`}
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-transparent" />

                  <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-lg sm:text-xl font-bold tracking-[-0.01em] text-white leading-tight">
                        {slide.title}
                      </p>
                      <p className="text-[11px] font-light text-white/80 mt-0.5 truncate">
                        {slide.subtitle}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(slide.href);
                      }}
                      aria-label={`Découvrir ${slide.title}`}
                      className="w-9 h-9 rounded-full bg-white text-black inline-flex items-center justify-center shrink-0 hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Interactive Progress Track */}
          <div className="px-5 sm:px-8 pb-6 flex items-center gap-1.5">
            {FASHION_SLIDES.map((s, idx) => (
              <button
                key={s.id}
                type="button"
                onClick={() => scrollToSlide(idx)}
                aria-label={`Aller à ${s.title}`}
                className={`h-[2px] flex-1 transition-colors cursor-pointer ${
                  idx === activeSlideIdx ? 'bg-[#E9B9C8]' : 'bg-white/20 hover:bg-white/45'
                }`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT: Minimalist Genres & Style Information Panel */}
        <div className="bg-white text-black px-6 py-10 sm:px-10 sm:py-12 lg:px-12 lg:py-14 flex flex-col justify-between">
          <div className="space-y-2 mb-8">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#D17493]">
              Genres &amp; Silhouettes
            </p>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-black leading-tight">
              L&apos;essentiel des coupes MIREZA.
            </h2>
          </div>

          <div className="flex-1 flex flex-col justify-center space-y-1">
            {FASHION_GENRES.map((genre) => {
              const selected = activeGenreId === genre.id;
              return (
                <div
                  key={genre.id}
                  className={`py-4 transition-colors ${
                    selected ? 'opacity-100' : 'opacity-65 hover:opacity-100'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => handleSelectGenre(genre)}
                    className="w-full flex items-baseline justify-between gap-4 text-left cursor-pointer"
                  >
                    <span className="text-base sm:text-lg font-bold tracking-[-0.01em] text-black">
                      {genre.name}
                    </span>
                    <span className="text-[11px] font-light text-black/60 whitespace-nowrap">
                      {genre.audience}
                    </span>
                  </button>

                  {selected && (
                    <div className="pt-2.5 space-y-3">
                      <p className="text-xs sm:text-[13px] font-light text-black/75 leading-relaxed">
                        {genre.summary}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[11px] text-black/60">
                        <span>{genre.fit}</span>
                        <span aria-hidden="true">&middot;</span>
                        <span>{genre.universe}</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => navigate(genre.href)}
                        className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-black hover:text-[#D17493] transition-colors cursor-pointer pt-0.5"
                      >
                        <span>Voir {genre.name}</span>
                        <ArrowUpRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
