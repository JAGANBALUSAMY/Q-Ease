import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/layout/Navbar';
import MobileNav from '@/components/layout/MobileNav';

const Layout = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Pages that should not show the navbar
  const hideNavbarPaths = ['/display'];
  const shouldHideNavbar = hideNavbarPaths.some(path => location.pathname.startsWith(path));

  // Check if we're on admin/staff pages (they have their own layout)
  const isAdminPath = location.pathname.startsWith('/admin');
  const isStaffPath = location.pathname.startsWith('/staff');
  const showMobileNav = user && !isAdminPath && !isStaffPath && !shouldHideNavbar;

  if (shouldHideNavbar) {
    return <Outlet />;
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main className={`flex-1 ${showMobileNav ? 'pb-20 md:pb-0' : ''}`}>
        <Outlet />
      </main>

      {/* Mobile Bottom Navigation (only for users, not admin/staff) */}
      {showMobileNav && <MobileNav />}
    </div>
  );
};

export default Layout;
