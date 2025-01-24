import React from 'react';

import { playlist, surah } from '@/constants';

type Props = {
  currentTrackId: number;
  duration: number;
  currentTime: number;
};
export default function Track({
  currentTrackId,
  duration,
  currentTime,
}: Props) {
  const currentTrack = playlist[currentTrackId];

  return (
    <main>
      {`${currentTrackId} - ${surah[currentTrack.surahId]} - ${currentTime}/${duration}`}
    </main>
  );
}
