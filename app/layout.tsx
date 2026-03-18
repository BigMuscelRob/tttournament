import type { Metadata } from 'next';
import './globals.css';
import { AppLayout } from '@/components/Layout';

export const metadata: Metadata = {
  title: 'Uni-TTC Turnier-Management',
  description: 'App zur Verwaltung von Tischtennisturnieren',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de" suppressHydrationWarning>
      <body>
        <AppLayout>
          {children}
        </AppLayout>
      </body>
    </html>
  );
}
