'use client';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import HomePage from '@/components/home-page';

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || undefined;

  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground">
      <div className="mt-10 flex w-full items-center justify-center transition-transform duration-200 hover:scale-105">
        <Image src="/logo.png" alt="logo" width={200} height={200} priority />
      </div>
      <div className="width-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">القرآن الكريم</h1>
      </div>
      <HomePage id={id} />
    </main>
  );
}
