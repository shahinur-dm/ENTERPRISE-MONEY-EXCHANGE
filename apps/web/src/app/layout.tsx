import type { Metadata } from 'next';
import './globals.css';
import { Shell } from '@/components/layout/Shell';

export const metadata: Metadata = {
  title: 'DAWAT ERP • Enterprise Money Exchange & International Remittance',
  description: 'Institutional Multi-Entity, Multi-Currency Financial Management & Cross-Border Settlement ERP System',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased selection:bg-blue-600 selection:text-white">
        <Shell>{children}</Shell>
      </body>
    </html>
  );
}
