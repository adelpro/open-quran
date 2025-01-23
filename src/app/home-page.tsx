'use client';

import { useAtom, useSetAtom } from 'jotai';
import React, { useEffect } from 'react';

import NarratorSelector from '@/components/narrator-selector';
import { narrators } from '@/constants';
import { selectedNarratorAtom } from '@/jotai/atom';
import { Narrator } from '@/types';
import MusicPlayer from '@/components/music-player';

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
    <>
      <NarratorSelector />
      <MusicPlayer />
    </>
  );
}
