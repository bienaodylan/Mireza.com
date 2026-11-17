import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, useReducedMotion } from 'motion/react';
import { ShoppingBag, User } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { useAuth } from '../../context/AuthContext';

export function Navbar() {
  const { route, navigate, cartCount, setCartOpen } = useStore();
  const { isAdmin } = useAuth();
  const shouldReduceMotion = useReducedMotion();

  const isHome = route.page === 'home';
  const { scrollY } = useScroll();

  const [viewport, setViewport] = useState(() => ({
    width: typeof window !== 'undefined' ? window.innerWidth : 1280,
    height: typeof window !== 'undefined' ? window.innerHeight : 800,
  }));
  const [solidHeader, setSolidHeader] = useState(false);

  useEffect(() => {
    const updateViewport = () => {
      setViewport({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };
    updateViewport();
    window.addEventListener('resize', updateViewport, { passive: true });
    return () => window.removeEventListener('resize', updateViewport);
  }, []);

  useEffect(() => {
    const threshold = isHome ? Math.max(320, Math.round(viewport.height * 0.65)) : 24;
    const onScroll = () => {
      setSolidHeader(window.scrollY > threshold);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome, viewport.height]);

  // Center of hero viewport down to exact center of the single-row fixed header
  const heroCenterY = Math.max(180, Math.round(viewport.height * 0.5 - 32));
  const dockEnd = Math.max(220, Math.round(viewport.height * 0.45));
  const bgFadeStart = Math.max(260, Math.round(viewport.height * 0.55));
  const bgFadeEnd = Math.max(380, Math.round(viewport.height * 0.78));

  const logoY = useTransform(scrollY, [0, dockEnd], [heroCenterY, 0]);
  const initialScale = viewport.width >= 768 ? 2.4 : 1.75;
  const logoScale = useTransform(scrollY, [0, dockEnd], [initialScale, 1]);
  const headerBgOpacity = useTransform(
    scrollY,
    isHome ? [bgFadeStart, bgFadeEnd] : [0, 32],
    [0, 1]
  );

  const navItems = [
    { label: 'Shop All', path: '/shop', key: 'shop' },
    { label: 'Jersey', path: '/category/jersey', key: 'jersey' },
    { label: 'Bikini', path: '/category/bikini', key: 'bikini' },
    { label: 'Set', path: '/category/set', key: 'set' },
    { label: 'Accessories', path: '/category/accessories', key: 'accessories' },
  ];

  const isItemActive = (key: string) => {
    if (key === 'shop') return route.page === 'shop' || route.page === 'new-drop';
    if (route.page === 'category') {
      if (key === 'jersey') return route.slug === 'jersey' || route.slug === 'jerseys';
      if (key === 'bikini') return route.slug === 'bikini' || route.slug === 'swimwear';
      return route.slug === key;
    }
    return false;
  };

  if (route.page === 'admin') {
    return null;
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-40 transition-colors duration-200">
      {/* Subtle top scrim over hero so pink header text & icons stay crisp at scrollY = 0 */}
      {isHome && !solidHeader && (
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
      )}

      {/* Solid black backdrop fades in on scroll / inner pages so all-pink header stays high-contrast */}
      <motion.div
        style={{
          opacity: shouldReduceMotion ? (solidHeader || !isHome ? 1 : 0) : headerBgOpacity,
        }}
        className="absolute inset-0 bg-black/95 backdrop-blur-sm pointer-events-none"
      />

      {/* Single-Row Fixed Header: Menus Left (middle-aligned) | MIREZA Logo Center | Small Icons Right — ALL IN PINK */}
      <div className="relative max-w-[1440px] mx-auto px-3 sm:px-6 xl:px-10 h-16 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4 text-[#E9B9C8]">
        {/* Left Zone: All Menus on the Same Line, Vertically Middle-Aligned, in Pink */}
        <nav
          aria-label="Primary Navigation"
          className="flex items-center justify-start gap-2.5 sm:gap-3.5 lg:gap-5 min-w-0 overflow-x-auto no-scrollbar text-[9.5px] sm:text-[10.5px] lg:text-[11px] font-bold uppercase tracking-[0.06em] sm:tracking-[0.1em] xl:tracking-[0.14em] text-[#E9B9C8]"
        >
          {navItems.map((item) => {
            const active = isItemActive(item.key);
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => navigate(item.path)}
                className={`whitespace-nowrap shrink-0 leading-none py-1 transition-opacity cursor-pointer text-[#E9B9C8] ${
                  active
                    ? 'opacity-100 underline underline-offset-4'
                    : 'opacity-80 hover:opacity-100'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Center Zone: MIREZA Logo Strictly Centered in Pink */}
        <div className="flex items-center justify-center">
          {isHome && !shouldReduceMotion ? (
            <motion.button
              type="button"
              onClick={() => navigate('/')}
              aria-label="MIREZA Home"
              style={{
                y: logoY,
                scale: logoScale,
              }}
              className="font-bold text-lg sm:text-xl xl:text-2xl tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#E9B9C8] whitespace-nowrap shrink-0 leading-none cursor-pointer"
            >
              MIREZA
            </motion.button>
          ) : (
            <button
              type="button"
              onClick={() => navigate('/')}
              aria-label="MIREZA Home"
              className="font-bold text-lg sm:text-xl xl:text-2xl tracking-[0.22em] sm:tracking-[0.26em] uppercase text-[#E9B9C8] whitespace-nowrap shrink-0 leading-none cursor-pointer"
            >
              MIREZA
            </button>
          )}
        </div>

        {/* Right Zone: Small Icons in Pink */}
        <div className="flex items-center justify-end gap-1 sm:gap-2 shrink-0 text-[#E9B9C8]">
          {isAdmin && (
            <button
              type="button"
              onClick={() => navigate('/admin')}
              className="hidden sm:inline-flex px-2.5 py-1 rounded-full text-[9.5px] font-bold uppercase tracking-[0.12em] whitespace-nowrap shrink-0 border border-[#E9B9C8]/70 text-[#E9B9C8] hover:bg-[#E9B9C8] hover:text-black transition-colors cursor-pointer"
            >
              Admin
            </button>
          )}

          <button
            type="button"
            onClick={() => navigate('/account')}
            aria-label="Account"
            className="p-1.5 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-[#E9B9C8] transition-opacity hover:opacity-75 cursor-pointer"
          >
            <User className="w-[17px] h-[17px]" strokeWidth={1.75} />
          </button>

          <button
            type="button"
            onClick={() => setCartOpen(true)}
            aria-label={`Shopping bag (${cartCount})`}
            className="relative p-1.5 min-h-[36px] min-w-[36px] inline-flex items-center justify-center text-[#E9B9C8] transition-opacity hover:opacity-75 cursor-pointer"
          >
            <ShoppingBag className="w-[17px] h-[17px]" strokeWidth={1.75} />
            {cartCount > 0 && (
              <span className="absolute top-0.5 right-0 min-w-[15px] h-[15px] px-1 rounded-full text-[9px] font-bold flex items-center justify-center tabular-nums bg-[#E9B9C8] text-black">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
