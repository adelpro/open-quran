import ReciterPage from '@/components/reciter-page';
import UnderConstruction from '@/components/under-construction';

import Logo from './logo';

export default function Home() {
  return (
    <main className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground">
      <Logo />
      <ReciterPage id={undefined} />
      <UnderConstruction />
    </main>
  );
}
