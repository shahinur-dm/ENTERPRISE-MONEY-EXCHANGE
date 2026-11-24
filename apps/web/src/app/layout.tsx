import type { Metadata } from 'next';
import './globals.css';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';

export const metadata: Metadata = {
  title: 'Enterprise Money Exchange & International Remittance ERP',
  description: 'Institutional Multi-Entity, Multi-Currency Financial Management & Cross-Border Remittance System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-x-hidden">
          <Header />
          <main className="flex-1 p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
