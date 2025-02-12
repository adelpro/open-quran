import Image from 'next/image';

import ReciterPage from '@/components/reciter-page';
import underconstructionSVG from '@/svgs/underconstruction.svg';

import Logo from './logo';

export default function Home() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground">
      <Logo />
      <ReciterPage id={undefined} />
      <div className="flex flex-row items-center justify-center gap-5">
        <Image
          src={underconstructionSVG}
          height={50}
          width={50}
          alt="Underconstruction"
        />
        <p>جاري التطوير</p>
      </div>
    </main>
  );
}
