'use client';

import 'jotai-devtools/styles.css';

import { useSetAtom } from 'jotai';
import { DevTools } from 'jotai-devtools';
import dynamic from 'next/dynamic';
import React, { useEffect } from 'react';

import PwaUpdater from '@/components/pwa-updater';
import { reciters } from '@/constants';
import { selectedReciterAtom } from '@/jotai/atom';
import { Reciter } from '@/types';

import ReciterrSelector from './reciter-selector';

type Props = { id: string | undefined };
export default function HomePage({ id }: Props) {
  const Torrent = dynamic(() => import('@/components/torrrent'), {
    ssr: false,
  });
  const setSelectedReciter = useSetAtom(selectedReciterAtom);

  useEffect(() => {
    if (!id) {
      setSelectedReciter(undefined);
      return;
    }
    const selectedReciter: Reciter = reciters[Number(id) - 1];
    if (!selectedReciter) {
      setSelectedReciter(undefined);
      return;
    }
    setSelectedReciter(selectedReciter);
  }, [id, setSelectedReciter]);

  return (
    <div className="flex w-full items-center justify-center p-2 md:p-5">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2">
        <DevTools />
        <ReciterrSelector />
        <Torrent />
        <PwaUpdater />
      </div>
    </div>
  );
}
