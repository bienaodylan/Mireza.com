import React from 'react';
import { useReducedMotion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { MIREZA_IMAGES } from '../lib/catalogDefaults';

export function HomePage() {
  const { categories, storefrontConfig, navigate } = useStore();
  const shouldReduceMotion = useReducedMotion();

  const visibleCategories = categories.filter((c) => c.slug !== 'sweat-wear');

  const renderSection = (key: string) => {
    switch (key) {
      case 'hero':
        return (
          <section
            key="hero"
            className="relative h-screen min-h-[620px] w-full overflow-hidden bg-black"
          >
            <img
              src={storefrontConfig.heroImageUrl || MIREZA_IMAGES.hero}
              alt="MIREZA Campaign"
              referrerPolicy="no-referrer"
              className="absolute inset-0 w-full h-full object-cover object-[center_20%]"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />

            {shouldReduceMotion && (
              <div className="relative z-10 h-full w-full flex items-center justify-center pointer-events-none">
                <span className="font-bold text-4xl md:text-6xl tracking-[0.28em] uppercase text-[#E9B9C8]">
                  MIREZA
                </span>
              </div>
            )}

            <div className="absolute bottom-8 left-5 right-5 md:bottom-12 md:left-10 md:right-10 z-20 flex flex-col md:flex-row md:items-end justify-between gap-5">
              <div className="max-w-xl space-y-2">
                <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                  Nouvelle Saison &middot; MIREZA Caribbean
                </p>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white leading-[1.06]">
                  {storefrontConfig.heroHeadline || 'Caribbean Poise & Bold Silhouettes'}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {storefrontConfig.heroCtaLabel || 'Explore Collections'}
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/category/accessories')}
                  className="px-6 py-2.5 rounded-full border border-[#E9B9C8] text-[#E9B9C8] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                >
                  Prochain Drop
                </button>
              </div>
            </div>
          </section>
        );

      case 'next_drop':
        return (
          <section key="next_drop" className="w-full bg-black">
            {/* Nude Project-Inspired 50/50 Edge-to-Edge Next Drop Showcase — Zero Margin */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
                <img
                  src={MIREZA_IMAGES.nextDropBanner}
                  alt="Prochaine Collection — Casquettes & Tapis MIREZA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                    Prochaine Collection &middot; Drop 02
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                    Casquettes &amp; Tapis MIREZA
                  </h2>
                  <p className="text-xs font-light text-white/85 max-w-md leading-relaxed">
                    Casquettes brodées multi-coloris et tapis tuftés atelier. La prochaine collection arrive bientôt.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/category/accessories')}
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      Voir le Prochain Drop
                    </button>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
                <img
                  src={MIREZA_IMAGES.lookbookCrew}
                  alt="Nouvelle Collection — MIREZA Caribbean"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                    Édition Actuelle &middot; Caribbean Drop
                  </p>
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                    Nouvelle Collection
                  </h2>
                  <p className="text-xs font-light text-white/85 max-w-md leading-relaxed">
                    Jerseys oversize en maille technique, bikinis iconiques et ensembles complets des îles.
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate('/new-drop')}
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      Explorer New Drop
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'categories':
        return (
          <section key="categories" className="w-full bg-black">
            {/* 1. 4-Column Edge-to-Edge Collections Strip — Text Directly ON Images, Zero Margins */}
            {visibleCategories.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
                {visibleCategories.map((cat, idx) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => navigate(`/category/${cat.slug}`)}
                    className="group relative aspect-[3/4] w-full overflow-hidden bg-black text-left cursor-pointer"
                  >
                    <img
                      src={cat.imageUrl}
                      alt={cat.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6 space-y-1.5">
                      <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#E9B9C8]">
                        Collection 0{idx + 1}
                      </p>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-base md:text-lg font-bold uppercase tracking-[0.1em] text-white">
                          {cat.name}
                        </span>
                        <span className="px-3.5 py-1 rounded-full bg-white/95 text-black text-[9px] font-bold uppercase tracking-[0.14em] group-hover:bg-[#E9B9C8] transition-colors">
                          Voir
                        </span>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* 2. 50/50 Edge-to-Edge Dual Collection Split: BIKINI & FULL SET */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-black">
                <img
                  src={MIREZA_IMAGES.bknBresil}
                  alt="Collection Bikini MIREZA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                    Caribbean Swimwear
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
                    Collection Bikini
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/category/bikini')}
                    className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                  >
                    Découvrir Bikini
                  </button>
                </div>
              </div>

              <div className="group relative aspect-[4/5] w-full overflow-hidden bg-black">
                <img
                  src={MIREZA_IMAGES.lookbookParis}
                  alt="Collection Full Set MIREZA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                    Ringer Baby Tee &amp; Short
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
                    Collection Set
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate('/category/set')}
                    className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                  >
                    Découvrir Set
                  </button>
                </div>
              </div>
            </div>

            {/* 3. 3-Column Triptych Edge-to-Edge — JERSEY Collection (Nude Project Outerwear Triptych Rhythm) */}
            <div className="relative grid grid-cols-1 md:grid-cols-3 gap-0">
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black">
                <img
                  src={MIREZA_IMAGES.lookbookJersey}
                  alt="Jamaica 19 Jersey MIREZA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black hidden md:block">
                <img
                  src="/assets/shopify/products/cote-d-ivoire-jersey__0.jpg"
                  alt="Côte d'Ivoire 225 Jersey MIREZA"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black hidden md:block">
                <img
                  src={MIREZA_IMAGES.lookbookBikini}
                  alt="MIREZA Resort Edition"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
              <div className="absolute bottom-6 left-5 md:bottom-10 md:left-8 z-10 space-y-2.5">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                  Maille Technique Mixte
                </p>
                <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
                  Collection Jersey
                </h3>
                <button
                  type="button"
                  onClick={() => navigate('/category/jersey')}
                  className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                >
                  Découvrir Jersey
                </button>
              </div>
            </div>

            {/* 4. Full-Bleed Widescreen Collection Banner — ACCESSORIES (Casquettes & Tapis) */}
            <div className="group relative w-full h-[460px] sm:h-[540px] md:h-[620px] overflow-hidden bg-black">
              <img
                src={MIREZA_IMAGES.nextDropBanner}
                alt="Collection Accessories — Casquettes & Tapis MIREZA"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
              <div className="absolute bottom-7 left-5 right-5 md:bottom-12 md:left-10 space-y-2.5 max-w-xl">
                <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
                  Casquettes Multi-Couleurs &amp; Tapis Tuftés Exclusivement
                </p>
                <h3 className="text-3xl sm:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                  Collection Accessories
                </h3>
                <div className="pt-1">
                  <button
                    type="button"
                    onClick={() => navigate('/category/accessories')}
                    className="px-6 py-2.5 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                  >
                    Explorer Accessories
                  </button>
                </div>
              </div>
            </div>
          </section>
        );

      case 'brand_intro':
        return (
          /* Sur Nous-Mêmes / À Propos: Black Background & All Pink Typography */
          <section key="brand_intro" className="w-full bg-black text-[#E9B9C8]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
              <div className="px-6 py-14 sm:px-10 sm:py-18 lg:px-16 lg:py-24 flex flex-col justify-center space-y-5 bg-black text-[#E9B9C8]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E9B9C8]">
                  Sur Nous &middot; L&apos;Identité MIREZA
                </p>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-[#E9B9C8] leading-[1.08]">
                  {storefrontConfig.brandIntroTitle}
                </h2>
                <p className="text-sm md:text-base font-light text-[#E9B9C8]/90 max-w-xl leading-relaxed">
                  {storefrontConfig.brandIntroBody}
                </p>
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate('/shop')}
                    className="px-6 py-2.5 rounded-full bg-[#E9B9C8] text-black text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8]/90 transition-colors cursor-pointer"
                  >
                    Explorer Toutes les Collections
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate('/category/accessories')}
                    className="px-6 py-2.5 rounded-full border border-[#E9B9C8] text-[#E9B9C8] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] hover:text-black transition-colors cursor-pointer"
                  >
                    Prochain Drop
                  </button>
                </div>
              </div>

              <div className="relative min-h-[380px] lg:min-h-[540px] w-full overflow-hidden bg-black">
                <img
                  src="/assets/shopify_editorial/ed_archives.jpg"
                  alt={storefrontConfig.brandIntroTitle || 'MIREZA Caribbean'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </section>
        );

      case 'mireza_world':
        return (
          <section key="mireza_world" className="w-full bg-black">
            {/* Edge-to-Edge 4-Column Lookbook Strip — Zero Margin, Writing on Images */}
            <div
              className={`grid grid-cols-2 ${
                storefrontConfig.galleryItems.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-4'
              } gap-0`}
            >
              {storefrontConfig.galleryItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => navigate('/shop')}
                  className="group relative aspect-[3/4] w-full overflow-hidden bg-black text-left cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-5 md:right-5 space-y-1">
                    <p className="text-[9.5px] font-bold uppercase tracking-[0.2em] text-[#E9B9C8]">
                      {item.tag}
                    </p>
                    <h3 className="text-xs sm:text-sm font-bold uppercase tracking-[0.06em] text-white">
                      {item.title}
                    </h3>
                  </div>
                </button>
              ))}
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  // Homepage strictly presents Collections, Next Drop, Brand Story (Black+Pink), and Lookbook — NO individual products
  const rawOrder = storefrontConfig.sectionOrder || [
    'hero',
    'next_drop',
    'categories',
    'brand_intro',
    'mireza_world',
  ];
  const order = rawOrder
    .filter((s) => s !== 'new_drop' && s !== 'featured' && s !== 'newsletter')
    .filter((s, idx, arr) => arr.indexOf(s) === idx);
  if (!order.includes('next_drop')) {
    const heroIdx = order.indexOf('hero');
    order.splice(heroIdx >= 0 ? heroIdx + 1 : 0, 0, 'next_drop');
  }

  return <main className="bg-black">{order.map((sec) => renderSection(sec))}</main>;
}
