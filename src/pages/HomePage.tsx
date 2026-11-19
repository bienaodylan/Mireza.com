import React from 'react';
import { useReducedMotion } from 'motion/react';
import { useStore } from '../context/StoreContext';
import { DEFAULT_STOREFRONT_CONFIG, MIREZA_IMAGES } from '../lib/catalogDefaults';
import { CustomHomepageSection } from '../types/commerce';
import { ProductCard } from '../components/storefront/ProductCard';
import { FashionDiscoverySection } from '../components/storefront/FashionDiscoverySection';

export function HomePage() {
  const { categories, products, getProductVariants, storefrontConfig, navigate } = useStore();
  const shouldReduceMotion = useReducedMotion();

  const visibleCategories = categories.filter((c) => c.slug !== 'sweat-wear');

  const collectionBanners =
    storefrontConfig.collectionBanners && storefrontConfig.collectionBanners.length > 0
      ? storefrontConfig.collectionBanners
      : DEFAULT_STOREFRONT_CONFIG.collectionBanners || [];

  const renderCustomSection = (section: CustomHomepageSection, renderKey: string) => {
    if (section.layout === 'split') {
      const isDark = section.theme !== 'light';
      return (
        <section
          key={renderKey}
          className={`w-full ${isDark ? 'bg-black text-[#E9B9C8]' : 'bg-white text-black'}`}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
            <div className="px-6 py-14 sm:px-10 sm:py-18 lg:px-16 lg:py-24 flex flex-col justify-center space-y-5">
              {section.eyebrow && (
                <p
                  className={`text-[11px] font-bold uppercase tracking-[0.24em] ${
                    isDark ? 'text-[#E9B9C8]' : 'text-[#D17493]'
                  }`}
                >
                  {section.eyebrow}
                </p>
              )}
              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] leading-[1.08]">
                {section.title}
              </h2>
              {section.body && (
                <p
                  className={`text-sm md:text-base font-light max-w-xl leading-relaxed ${
                    isDark ? 'text-[#E9B9C8]/90' : 'text-black/75'
                  }`}
                >
                  {section.body}
                </p>
              )}
              {section.ctaLabel && (
                <div className="pt-2 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => navigate(section.ctaHref || '/shop')}
                    className={`px-6 py-2.5 rounded-full text-[11px] font-bold uppercase tracking-[0.14em] transition-colors cursor-pointer ${
                      isDark
                        ? 'bg-[#E9B9C8] text-black hover:bg-[#E9B9C8]/90'
                        : 'bg-black text-white hover:bg-black/85'
                    }`}
                  >
                    {section.ctaLabel}
                  </button>
                </div>
              )}
            </div>
            <div className="relative min-h-[380px] lg:min-h-[540px] w-full overflow-hidden bg-black">
              <img
                src={section.imageUrl}
                alt={section.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </section>
      );
    }

    if (section.layout === 'duo') {
      return (
        <section key={renderKey} className="w-full bg-black">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
              <img
                src={section.imageUrl}
                alt={section.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                  {section.title}
                </h2>
                {section.body && (
                  <p className="text-xs font-light text-white/85 max-w-md leading-relaxed">
                    {section.body}
                  </p>
                )}
                {section.ctaLabel && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(section.ctaHref || '/shop')}
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      {section.ctaLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
              <img
                src={section.secondaryImageUrl || section.imageUrl}
                alt={section.secondaryTitle || section.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
              <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                  {section.secondaryTitle || section.title}
                </h2>
                {section.secondaryCtaLabel && (
                  <div className="pt-1">
                    <button
                      type="button"
                      onClick={() => navigate(section.secondaryCtaHref || '/shop')}
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      {section.secondaryCtaLabel}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      );
    }

    // Default: Full-width widescreen single-image banner matching Jersey/Bikini/Set proportions
    return (
      <section key={renderKey} className="w-full bg-black">
        <div className="group relative w-full aspect-[16/10] sm:aspect-[2/1] lg:aspect-[1800/760] overflow-hidden bg-black">
          <img
            src={section.imageUrl}
            alt={section.title}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
          <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 z-10 space-y-2.5 max-w-xl">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
              {section.title}
            </h2>
            {section.body && (
              <p className="text-xs sm:text-sm font-light text-white/85 leading-relaxed">
                {section.body}
              </p>
            )}
            {section.ctaLabel && (
              <div className="pt-1">
                <button
                  type="button"
                  onClick={() => navigate(section.ctaHref || '/shop')}
                  className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                >
                  {section.ctaLabel}
                </button>
              </div>
            )}
          </div>
        </div>
      </section>
    );
  };

  const renderSection = (key: string, idx: number) => {
    const renderKey = `${key}_${idx}`;

    if (key.startsWith('custom:')) {
      const customId = key.slice('custom:'.length);
      const found = (storefrontConfig.customSections || []).find((s) => s.id === customId);
      return found ? renderCustomSection(found, renderKey) : null;
    }

    switch (key) {
      case 'hero':
        return (
          <section
            key={renderKey}
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
              <div className="max-w-xl">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-[-0.02em] text-white leading-[1.06]">
                  {storefrontConfig.heroHeadline || 'Caribbean Poise & Bold Silhouettes'}
                </h1>
              </div>
              <div className="flex flex-wrap items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => navigate(storefrontConfig.heroCtaHref || '/shop')}
                  className="px-6 py-2.5 rounded-full bg-white text-black text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer whitespace-nowrap"
                >
                  {storefrontConfig.heroCtaLabel || 'Explore Collections'}
                </button>
                {(storefrontConfig.heroSecondaryCtaLabel ?? 'Nouvelle Collection') && (
                  <button
                    type="button"
                    onClick={() =>
                      navigate(storefrontConfig.heroSecondaryCtaHref || '/collection/casquettes-tapis')
                    }
                    className="px-6 py-2.5 rounded-full border border-[#E9B9C8] text-[#E9B9C8] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] hover:text-black transition-colors cursor-pointer whitespace-nowrap"
                  >
                    {storefrontConfig.heroSecondaryCtaLabel || 'Nouvelle Collection'}
                  </button>
                )}
              </div>
            </div>
          </section>
        );

      case 'next_drop':
        return (
          <section key={renderKey} className="w-full bg-black">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
                <img
                  src={storefrontConfig.nextDropLeftImageUrl || MIREZA_IMAGES.nextDropBanner}
                  alt={storefrontConfig.nextDropLeftTitle || 'Casquettes & Tapis MIREZA'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                    {storefrontConfig.nextDropLeftTitle || 'Casquettes & Tapis MIREZA'}
                  </h2>
                  <p className="text-xs font-light text-white/85 max-w-md leading-relaxed">
                    {storefrontConfig.nextDropLeftBody ||
                      'Nouvelle collection d’accessoires signature : casquettes brodées multi-coloris et tapis tuftés atelier.'}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(storefrontConfig.nextDropLeftCtaHref || '/collection/casquettes-tapis')
                      }
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      {storefrontConfig.nextDropLeftCtaLabel || 'Découvrir la Collection'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="group relative aspect-[4/5] md:aspect-[5/6] w-full overflow-hidden bg-black">
                <img
                  src={storefrontConfig.nextDropRightImageUrl || MIREZA_IMAGES.lookbookCrew}
                  alt={storefrontConfig.nextDropRightTitle || 'Nouvelle Collection'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-[1.03]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-5 right-5 md:bottom-10 md:left-8 space-y-2.5">
                  <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-[-0.02em] text-white leading-tight">
                    {storefrontConfig.nextDropRightTitle || 'Nouvelle Collection'}
                  </h2>
                  <p className="text-xs font-light text-white/85 max-w-md leading-relaxed">
                    {storefrontConfig.nextDropRightBody ||
                      'Jerseys oversize en maille technique, bikinis iconiques et ensembles complets des îles.'}
                  </p>
                  <div className="pt-1 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          storefrontConfig.nextDropRightCtaHref || '/collection/nouvelle-collection'
                        )
                      }
                      className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                    >
                      {storefrontConfig.nextDropRightCtaLabel || 'Découvrir la Collection'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        );

      case 'categories': {
        const accessoriesCat = visibleCategories.find((c) => c.slug === 'accessories');
        const categoryCards = [
          ...visibleCategories
            .filter((c) => c.slug !== 'accessories')
            .slice(0, 3)
            .map((c) => ({
              id: c.id,
              name: c.name,
              imageUrl: c.imageUrl,
              href: `/category/${c.slug}`,
            })),
          {
            id: 'view-all',
            name: 'View All',
            imageUrl: accessoriesCat?.imageUrl || MIREZA_IMAGES.nextDropBanner,
            href: '/shop',
          },
        ];

        return (
          <section key={renderKey} className="w-full bg-black">
            {/* 1. 4-Column Category Strip: Jersey, Bikini, Set, View All */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-0">
              {categoryCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => navigate(card.href)}
                  className="group relative aspect-[3/4] w-full overflow-hidden bg-black text-left cursor-pointer"
                >
                  <img
                    src={card.imageUrl}
                    alt={card.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 md:bottom-6 md:left-6 md:right-6">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-base md:text-lg font-bold uppercase tracking-[0.1em] text-white">
                        {card.name}
                      </span>
                      <span className="px-3.5 py-1 rounded-full bg-white/95 text-black text-[9px] font-bold uppercase tracking-[0.14em] group-hover:bg-[#E9B9C8] transition-colors">
                        Voir
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* 2. Stacked Full-Width Single-Image Banners (Jersey, Bikini, Set) — Exact Uniform Banner Size */}
            {collectionBanners.map((banner) => (
              <div
                key={banner.id}
                className="group relative w-full aspect-[16/10] sm:aspect-[2/1] lg:aspect-[1800/760] overflow-hidden bg-black"
              >
                <img
                  src={banner.imageUrl}
                  alt={banner.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.02]"
                />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent" />
                <div className="absolute bottom-6 left-5 md:bottom-10 md:left-8 z-10 space-y-2.5">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-white">
                    {banner.title}
                  </h3>
                  <button
                    type="button"
                    onClick={() => navigate(banner.href || '/shop')}
                    className="px-5 py-2 rounded-full bg-white text-black text-[10px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] transition-colors cursor-pointer"
                  >
                    {banner.ctaLabel || `Découvrir ${banner.title}`}
                  </button>
                </div>
              </div>
            ))}
          </section>
        );
      }

      case 'fashion_discovery':
        return <FashionDiscoverySection key={renderKey} />;

      case 'brand_intro':
        return (
          <section key={renderKey} className="w-full bg-black text-[#E9B9C8]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 items-stretch">
              <div className="px-6 py-14 sm:px-10 sm:py-18 lg:px-16 lg:py-24 flex flex-col justify-center space-y-5 bg-black text-[#E9B9C8]">
                <p className="text-[11px] font-bold uppercase tracking-[0.24em] text-[#E9B9C8]">
                  {storefrontConfig.brandIntroEyebrow || "Sur Nous · L'Identité MIREZA"}
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
                    onClick={() => navigate(storefrontConfig.brandIntroCtaHref || '/shop')}
                    className="px-6 py-2.5 rounded-full bg-[#E9B9C8] text-black text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8]/90 transition-colors cursor-pointer"
                  >
                    {storefrontConfig.brandIntroCtaLabel || 'Explorer Toutes les Collections'}
                  </button>
                  {(storefrontConfig.brandIntroSecondaryCtaLabel ?? 'Nouvelle Collection') && (
                    <button
                      type="button"
                      onClick={() =>
                        navigate(
                          storefrontConfig.brandIntroSecondaryCtaHref || '/collection/casquettes-tapis'
                        )
                      }
                      className="px-6 py-2.5 rounded-full border border-[#E9B9C8] text-[#E9B9C8] text-[11px] font-bold uppercase tracking-[0.14em] hover:bg-[#E9B9C8] hover:text-black transition-colors cursor-pointer"
                    >
                      {storefrontConfig.brandIntroSecondaryCtaLabel || 'Nouvelle Collection'}
                    </button>
                  )}
                </div>
              </div>

              <div className="relative min-h-[380px] lg:min-h-[540px] w-full overflow-hidden bg-black">
                <img
                  src={storefrontConfig.brandIntroImageUrl || '/assets/shopify_editorial/ed_archives.jpg'}
                  alt={storefrontConfig.brandIntroTitle || 'MIREZA Caribbean'}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>
          </section>
        );

      case 'new_drop': {
        const dropItems = products.filter((p) => p.isNewDrop).slice(0, 4);
        if (dropItems.length === 0) return null;
        return (
          <section key={renderKey} className="w-full bg-white py-12 px-4 md:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-black">
                New Drop
              </h2>
              <button
                type="button"
                onClick={() => navigate('/new-drop')}
                className="px-5 py-2 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer"
              >
                Voir Tout
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 items-stretch">
              {dropItems.map((p) => (
                <ProductCard key={p.id} product={p} variants={getProductVariants(p.id)} />
              ))}
            </div>
          </section>
        );
      }

      case 'featured': {
        const featuredItems = products.filter((p) => p.isFeatured).slice(0, 4);
        if (featuredItems.length === 0) return null;
        return (
          <section key={renderKey} className="w-full bg-white py-12 px-4 md:px-8">
            <div className="flex items-end justify-between mb-6">
              <h2 className="text-2xl md:text-3xl font-bold tracking-[-0.02em] text-black">
                Sélection MIREZA
              </h2>
              <button
                type="button"
                onClick={() => navigate('/shop')}
                className="px-5 py-2 rounded-full bg-black text-white text-[10px] font-bold uppercase tracking-[0.14em] cursor-pointer"
              >
                Tout Voir
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-6 sm:gap-x-4 sm:gap-y-8 items-stretch">
              {featuredItems.map((p) => (
                <ProductCard key={p.id} product={p} variants={getProductVariants(p.id)} />
              ))}
            </div>
          </section>
        );
      }

      case 'mireza_world':
        if (!storefrontConfig.galleryItems || storefrontConfig.galleryItems.length === 0) {
          return null;
        }
        return (
          <section key={renderKey} className="w-full bg-black">
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

  const order = (storefrontConfig.sectionOrder || DEFAULT_STOREFRONT_CONFIG.sectionOrder).filter(
    (s) => s !== 'newsletter'
  );

  return <main className="bg-black">{order.map((sec, idx) => renderSection(sec, idx))}</main>;
}
