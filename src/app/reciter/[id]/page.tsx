import Image from 'next/image';
import { notFound } from 'next/navigation';

import ReciterPage from '@/components/reciter-page';
import { RECITERS } from '@/constants';
import { clientConfig, normalizeAppUrl } from '@/utils';

type Props = {
  params: Promise<{
    id: string | undefined;
  }>;
};

export async function generateStaticParams() {
  return RECITERS.map((reciter) => ({
    params: {
      id: reciter.id.toString(),
    },
  }));
}
export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const reciter = RECITERS.find((reciter) => reciter.id === Number(id));

  if (!reciter)
    return {
      title: clientConfig.APP_NAME,
    };
  return {
    metadataBase: new URL(clientConfig.APP_URL),
    manifest: 'manifest.json',
    title: `${reciter?.name} | ${clientConfig.APP_NAME}`,
    description: `استمع إلى تلاوات ${reciter?.name}`,
    openGraph: {
      title: `${reciter?.name} | ${clientConfig.APP_NAME}`,
      description: `استمع إلى تلاوات ${reciter?.name}`,
      url: `${normalizeAppUrl(clientConfig.APP_URL)}/reciter/${reciter?.id}`,
      images: [
        {
          url: `/logo-og.png`,
          width: 1024,
          height: 1024,
          alt: `${clientConfig.APP_NAME}`,
        },
      ],
      siteName: `${clientConfig.APP_NAME}`,
    },
    twitter: {
      card: 'summary_large_image',
      title: `${reciter?.name} | ${clientConfig.APP_NAME}`,
      description: `استمع إلى تلاوات ${reciter?.name}`,
      images: [
        {
          url: `/logo-og.png`,
          width: 1024,
          height: 1024,
          alt: 'Quran - سيل القرآن',
        },
      ],
      site: `${clientConfig.APP_NAME}`,
    },
  };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const reciter = RECITERS.find((reciter) => reciter.id === Number(id));
  if (!reciter) {
    return notFound();
  }
  return (
    <>
      <script
        type="application/ldjson"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Person',
            name: reciter.name,
            url: `${normalizeAppUrl(clientConfig.APP_URL)}/reciter/${reciter.id}`,
          }),
        }}
      />
      <main className="flex h-dvh w-full flex-col items-center justify-center bg-background text-foreground">
        <div className="mt-10 flex w-full items-center justify-center transition-transform duration-200 hover:scale-105">
          <Image src="/logo.png" alt="logo" width={200} height={200} priority />
        </div>
        <div className="width-full flex items-center justify-center">
          <h1 className="text-4xl font-bold">القرآن الكريم</h1>
        </div>
        <ReciterPage id={reciter.id} />
      </main>
    </>
  );
}
