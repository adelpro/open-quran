'use client';

import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';

import MusicPlayer from '@/components/music-player';
import NarratorSelector from '@/components/narrator-selector';
import PwaUpdater from '@/components/pwa-updater';
import { narrators, playlist } from '@/constants';
import { selectedNarratorAtom } from '@/jotai/atom';
import { Narrator } from '@/types';

type Props = { id: string | undefined };
export default function HomePage({ id }: Props) {
  const setSelectedNarrator = useSetAtom(selectedNarratorAtom);

  useEffect(() => {
    if (!id) {
      setSelectedNarrator(undefined);
      return;
    }
    const selectedNarrator: Narrator = narrators[Number(id) - 1];
    if (!selectedNarrator) {
      setSelectedNarrator(undefined);
      return;
    }
    setSelectedNarrator(selectedNarrator);
  }, [id, setSelectedNarrator]);

  return (
    <div className="flex w-full items-center justify-center p-2 md:p-5">
      <div className="flex w-full max-w-lg flex-col items-center justify-center gap-2">
        <NarratorSelector />
        <MusicPlayer playlist={playlist} />
        <PwaUpdater />
      </div>
    </div>
  );
}
