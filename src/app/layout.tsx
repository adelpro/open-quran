import './globals.css';

import type { Metadata } from 'next';
import { Tajawal } from 'next/font/google';
const tajawal = Tajawal({
  weight: ['400', '700', '900'],
  subsets: ['arabic'],
  preload: true,
});
export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_APP_NAME}`,
  description: 'استمع إلى تلاوات سيل القرآن',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar">
      <body className={`${tajawal.className} antialiased`}>{children}</body>
    </html>
  );
}
