import './globals.css';

import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
const tajawal = Tajawal({
  weight: ['400', '700', '900'],
  subsets: ['arabic'],
  preload: true,
});
export const metadata: Metadata = {
  title: 'Quran Stream - سيل القرآن',
  description: 'Quran streaming application',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${tajawal.className} antialiased`}>{children}</body>
    </html>
  );
}
