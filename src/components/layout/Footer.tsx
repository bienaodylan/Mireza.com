import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { subscribeNewsletter } from '../../lib/firestoreService';

export function Footer() {
  const { navigate, storefrontConfig, toast } = useStore();
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = email.trim();
    if (!clean || !clean.includes('@')) {
      toast('Please enter a valid email address.', 'error');
      return;
    }
    setSubmitting(true);
    try {
      await subscribeNewsletter(clean, 'footer');
      setSubscribed(true);
      setEmail('');
      toast('Welcome to the MIREZA Private List.', 'success');
    } catch {
      toast('Could not subscribe right now. Please try again.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <footer className="bg-black text-[#E9B9C8] overflow-hidden">
      {/* Newsletter Band */}
      <div>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 md:py-18 grid grid-cols-1 lg:grid-cols-12 gap-8 items-end">
          <div className="lg:col-span-6 space-y-2.5">
            <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[#E9B9C8]">
              Private Correspondence
            </p>
            <h2 className="font-editorial text-3xl md:text-4xl text-[#E9B9C8] leading-tight">
              {storefrontConfig.newsletterTitle}
            </h2>
            <p className="text-sm font-light text-[#E9B9C8]/80 max-w-lg leading-relaxed">
              {storefrontConfig.newsletterBody}
            </p>
          </div>
          <div className="lg:col-span-6">
            {subscribed ? (
              <div className="p-4 rounded-2xl border border-[#E9B9C8]/40 bg-[#E9B9C8]/10 text-xs font-light tracking-wide text-[#E9B9C8]">
                Thank you. Your address has been registered for private MIREZA previews.
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  aria-label="Email address for newsletter"
                  className="flex-1 rounded-full bg-transparent border border-[#E9B9C8]/40 px-5 py-3 text-sm font-light text-[#E9B9C8] placeholder:text-[#E9B9C8]/50 focus:outline-none focus:border-[#E9B9C8]"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-8 py-3 rounded-full bg-[#E9B9C8] text-black text-xs font-bold uppercase tracking-[0.18em] hover:bg-[#E9B9C8]/90 transition-colors disabled:opacity-50 whitespace-nowrap cursor-pointer"
                >
                  {submitting ? 'Joining...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer Columns — All Typography in Pink */}
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-14 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 space-y-4">
          <div className="font-bold text-2xl tracking-[0.24em] uppercase text-[#E9B9C8]">
            MIREZA
          </div>
          <p className="text-xs font-light text-[#E9B9C8]/80 leading-relaxed max-w-xs">
            Beachwear caribéen, jerseys oversize, full sets et accessoires signature.
          </p>
          <div className="text-xs font-light text-[#E9B9C8]/75 space-y-1 pt-2">
            <p>{storefrontConfig.supportEmail || 'contact@mireza.com'}</p>
            <p>{storefrontConfig.supportPhone || '+225 07 00 00 00 00'}</p>
          </div>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E9B9C8]">
            Collections
          </p>
          <ul className="space-y-2 text-xs font-light text-[#E9B9C8]/85">
            <li>
              <button onClick={() => navigate('/shop')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Shop All
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/new-drop')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                New Drop
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/jersey')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Jersey
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/bikini')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Bikini
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/set')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Set
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/category/accessories')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Accessories
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E9B9C8]">
            Client Services
          </p>
          <ul className="space-y-2 text-xs font-light text-[#E9B9C8]/85">
            <li>
              <button onClick={() => navigate('/account')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Account &amp; Profile
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/orders')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Order History
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/legal/shipping')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Shipping &amp; Delivery
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/legal/returns')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Returns &amp; Exchanges
              </button>
            </li>
          </ul>
        </div>

        <div className="space-y-3">
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#E9B9C8]">
            House &amp; Legal
          </p>
          <ul className="space-y-2 text-xs font-light text-[#E9B9C8]/85">
            <li>
              <button onClick={() => navigate('/legal/privacy')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => navigate('/legal/terms')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Terms of Sale
              </button>
            </li>
            <li>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#E9B9C8] hover:underline"
              >
                Instagram
              </a>
            </li>
            <li>
              <button onClick={() => navigate('/admin')} className="hover:text-[#E9B9C8] hover:underline cursor-pointer">
                Atelier Administration
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div>
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-light text-[#E9B9C8]/75">
          <p>&copy; {new Date().getFullYear()} MIREZA. All rights reserved.</p>
          <p>Currency: West African CFA Franc (XOF) &middot; Wave &middot; Orange Money &middot; Visa &middot; Mastercard</p>
        </div>
      </div>

      {/* Oversized Nude Project-Inspired Wordmark Footer Signature in Pink */}
      <div className="w-full px-3 md:px-6 pb-4 pt-2 select-none pointer-events-none">
        <div className="w-full text-center font-bold uppercase tracking-[-0.04em] leading-[0.82] text-[19vw] text-[#E9B9C8]">
          MIREZA
        </div>
      </div>
    </footer>
  );
}
