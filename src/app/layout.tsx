import './globals.css';

import type { Metadata } from 'next';
import { Scheherazade_New } from 'next/font/google';

const scheherazade_New = Scheherazade_New({
  subsets: ['arabic'],
  weight: ['400', '700'],
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
      <body className={`${scheherazade_New.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}
