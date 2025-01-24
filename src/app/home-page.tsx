'use client';

import { useSetAtom } from 'jotai';
import React, { useEffect } from 'react';

import MusicPlayer from '@/components/music-player';
import NarratorSelector from '@/components/narrator-selector';
import { narrators } from '@/constants';
import { selectedNarratorAtom } from '@/jotai/atom';
import { Narrator } from '@/types';

const playlist: string[] = [
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/001.mp3',
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/002.mp3',
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/003.mp3',
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/004.mp3',
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/005.mp3',
  'https://server7.mp3quran.net/basit/Almusshaf-Al-Mojawwad/006.mp3',
];

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
    <div className="m-5 flex w-full flex-col items-center justify-center gap-5">
      <NarratorSelector />
      <MusicPlayer playlist={playlist} />
    </div>
  );
}
