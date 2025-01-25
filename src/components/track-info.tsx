import React from 'react';

import { playlist, surahs } from '@/constants';
import { formatTime } from '@/utils';

type Props = {
  currentTrackId: number;
  duration: number;
  currentTime: number;
};
export default function TrackInfo({
  currentTrackId,
  duration,
  currentTime,
}: Props) {
  const currentTrack = playlist[currentTrackId];
  const { surahId } = currentTrack;
  const surahName = surahs.find((s) => s.id === surahId)?.name;

  return (
    <div className="flex items-center justify-center gap-2 font-bold text-gray-500">
      <span>{`${surahId} - ${surahName}`}</span>
      <span>{`(${formatTime(currentTime)} ${formatTime(duration)})`}</span>
    </div>
  );
}
