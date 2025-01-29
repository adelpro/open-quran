'use client';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';

import HomePage from './home-page';

export default function Home() {
  const searchParams = useSearchParams();
  const id = searchParams.get('id') || undefined;

  return (
    <main className="bg-background text-foreground">
      <div className="width-full mt-10 flex items-center justify-center">
        <Image src="/logo.png" alt="logo" width={400} height={400} priority />
      </div>
      <div className="width-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">القرآن الكريم</h1>
      </div>
      <HomePage id={id} />
    </main>
  );
}
