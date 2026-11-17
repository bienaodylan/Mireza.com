import React from 'react';
import { ErrorBoundary } from './components/ErrorBoundary';
import { AuthProvider } from './context/AuthContext';
import { StoreProvider, useStore } from './context/StoreContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/cart/CartDrawer';
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AccountPage } from './pages/AccountPage';
import { LegalPage } from './pages/LegalPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

function AppRouter() {
  const { route } = useStore();

  if (route.page === 'admin') {
    return <AdminDashboard />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-black font-light">
      <Navbar />
      <CartDrawer />
      <div className="flex-1">
        {route.page === 'home' && <HomePage />}
        {route.page === 'shop' && <CatalogPage mode="all" />}
        {route.page === 'new-drop' && <CatalogPage mode="new-drop" />}
        {route.page === 'category' && <CatalogPage mode="category" categorySlug={route.slug} />}
        {route.page === 'product' && <ProductDetailPage slug={route.slug} />}
        {route.page === 'cart' && <CartPage />}
        {route.page === 'checkout' && <CheckoutPage />}
        {route.page === 'account' && <AccountPage defaultTab="profile" />}
        {route.page === 'orders' && <AccountPage defaultTab="orders" />}
        {route.page === 'legal' && <LegalPage docType={route.docType} />}
      </div>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <StoreProvider>
          <AppRouter />
        </StoreProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}
