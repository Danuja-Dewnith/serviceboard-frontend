import type { ReactNode } from 'react';
import './globals.css';

export const metadata = {
  title: 'ServiceBoard — Find Expert Tradespeople',
  description: 'Reliable service connections for plumbing, electrical, and more.',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}