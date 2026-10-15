import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';
import Topbar from './Topbar';

/**
 * AppShell Layout Component
 * Strictly implements the Global Application Shell geometry:
 * - Fixed 248px Sidebar
 * - Fixed 64px Topbar
 * - Controlled max-width: 1600px content area
 * - Responsive screen padding tiers (16px to 32px)
 */
export const AppShell = ({ user, shop, onLogout }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-[100dvh] w-full bg-[#050608] dark:bg-[#050608] light:bg-[#F7F8FA] flex text-[#F5F7FA] dark:text-[#F5F7FA] light:text-[#18181B] font-sans antialiased transition-colors duration-150">
      {/* 1. Desktop & Tablet Sidebar (Exactly 248px) */}
      <Sidebar
        user={user}
        onLogout={onLogout}
        className="hidden lg:flex shrink-0 w-[248px] min-w-[248px]"
      />

      {/* 2. Mobile Drawer Sidebar (Max 280px / 85vw) */}
      <MobileSidebar
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        user={user}
        onLogout={onLogout}
      />

      {/* 3. Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-[100dvh]">
        <Topbar
          onMenuClick={() => setMobileMenuOpen(true)}
          user={user}
          shop={shop}
          onLogout={onLogout}
        />

        <main className="flex-1 overflow-y-auto overflow-x-hidden bg-[#050608] dark:bg-[#050608] light:bg-[#F7F8FA] transition-colors duration-150">
          <div className="w-full max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 pt-7 pb-10">
            <Outlet />
          </div>
        </main>

        {/* 4. Bottom Pro Buttons Bar */}
        <footer className="sticky bottom-0 z-30 w-full py-2 px-3 sm:px-6 bg-[#080B11]/90 backdrop-blur-md border-t border-[#1F2736]/70 flex items-center justify-center gap-2 sm:gap-3 flex-wrap shadow-lg">
          <button
            type="button"
            className="pro-btn btn-buy-pro"
            onClick={() => window.open('https://wa.me/919898048483', '_blank')}
          >
            ⚡ BUY NOW PRO (APPOINTMENT)
          </button>
          <button
            type="button"
            className="pro-btn btn-donate"
            onClick={() =>
              window.open(
                'https://docs.google.com/forms/d/e/1FAIpQLScJ7WjuxEXqdoSlUtxN7NQ8UeKpbEAeA9iIO-IXOmBmYzlLHQ/viewform?usp=sharing&ouid=116676179363878319046',
                '_blank'
              )
            }
          >
            🪙 DONATION SYSTEM
          </button>
          <button
            type="button"
            className="pro-btn btn-store"
            onClick={() => window.open('https://wa.me/c/919898048483', '_blank')}
          >
            🛒 OFFICIAL DIGITAL STORE
          </button>
        </footer>
      </div>
    </div>
  );
};

export default AppShell;
