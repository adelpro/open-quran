import Image from 'next/image';

import NaratorsList from '@/components/narator-list';
import { narators } from '@/constants';

export default function Home() {
  return (
    <main className="bg-background text-foreground">
      <div className="width-full mt-10 flex items-center justify-center">
        <Image src="/logo.png" alt="logo" width={400} height={400} />
      </div>

      <div className="width-full flex items-center justify-center">
        <h1 className="text-4xl font-bold">مرحبا بك في موقع مزامير داوود</h1>
      </div>
      <NaratorsList selectedNarators={narators} />
    </main>
  );
}
