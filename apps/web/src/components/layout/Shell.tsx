'use client';

import React, { useState } from 'react';
import { usePathname } from 'next/navigation';
import { AppSidebar } from './AppSidebar';
import { MobileSidebar } from './MobileSidebar';
import { AppHeader } from './AppHeader';
import { I18nProvider } from '@/lib/i18n';

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (isLoginPage) {
    return <main className="min-h-screen w-full bg-slate-900">{children}</main>;
  }

  return (
    <I18nProvider>
      <div className="flex min-h-screen bg-[#F5F7FB] text-slate-900 font-sans antialiased overflow-x-hidden">
        {/* 1. Desktop Fixed Sidebar (hidden on < lg) */}
        <AppSidebar />

        {/* 2. Mobile Drawer Navigation (visible on < lg when opened) */}
        <MobileSidebar
          isOpen={mobileMenuOpen}
          onClose={() => setMobileMenuOpen(false)}
        />

        {/* 3. Main Content Container */}
        <div className="flex flex-1 flex-col min-w-0 overflow-x-hidden">
          {/* Top Header */}
          <AppHeader onMenuToggle={() => setMobileMenuOpen(true)} />

          {/* Content Viewport */}
          <main className="flex-1 p-3.5 sm:p-5 md:p-6 lg:p-8 w-full max-w-[1600px] mx-auto min-w-0">
            {children}
          </main>
        </div>
      </div>
    </I18nProvider>
  );
}
