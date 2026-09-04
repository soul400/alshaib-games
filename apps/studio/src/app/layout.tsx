import React from 'react';
import './globals.css';
import { TopHeaderLiveBar } from '../components/layout/TopHeaderLiveBar';
import { AppSidebar } from '../components/layout/AppSidebar';
import { DonationQRBadge } from '../components/layout/DonationQRBadge';
import { ClientErrorGuard } from '../components/layout/ClientErrorGuard';
import { AuthGuard } from '../components/auth/AuthGuard';

export const metadata = {
  title: 'الشايب للترفيه - AL-SHAIB ENTERTAINMENT',
  description: 'المنصة العالمية لبث المسابقات التفاعلية والعروض الترفيهية المباشرة',
  icons: {
    icon: '/alshaib-logo.png',
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                function isEventLike(err) {
                  if (!err) return false;
                  if (typeof Event !== 'undefined' && err instanceof Event) return true;
                  if (typeof err === 'object') {
                    if (err.isTrusted !== undefined) return true;
                    if (err.bubbles !== undefined) return true;
                    if (err.type !== undefined && (err.target !== undefined || err.currentTarget !== undefined)) return true;
                    var s = Object.prototype.toString.call(err);
                    if (s === '[object Event]' || s === '[object CustomEvent]' || s === '[object ErrorEvent]') return true;
                  }
                  return false;
                }
                window.addEventListener('error', function(e) {
                  if (isEventLike(e) || isEventLike(e.error)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return true;
                  }
                }, true);
                window.addEventListener('unhandledrejection', function(e) {
                  if (isEventLike(e.reason)) {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return true;
                  }
                }, true);
              })();
            `
          }}
        />
      </head>
      <body className="min-h-screen flex broadcast-obsidian-bg text-[#F8FAFC] selection:bg-[#D6A84F]/30 selection:text-[#D6A84F]">
        {/* Global Client Error Interceptor */}
        <ClientErrorGuard />

        {/* VIP Broadcast Auth Guard */}
        <AuthGuard>
          {/* Compact Command Sidebar (72px) */}
          <AppSidebar />

          {/* Main Command & Stage Area */}
          <div className="flex-1 flex flex-col min-w-0 min-h-screen">
            {/* Top Header Live Command Bar */}
            <TopHeaderLiveBar />

            {/* Main Stage View Area */}
            <main className="flex-1 w-full p-4 sm:p-6 lg:p-8">
              {children}
            </main>
          </div>

          {/* Floating Broadcast Donation QR Badge */}
          <DonationQRBadge />
        </AuthGuard>
      </body>
    </html>
  );
}
