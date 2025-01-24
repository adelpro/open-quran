import backwardSVG from '@svgs/music-backward.svg';
import forwardSVG from '@svgs/music-forward.svg';
import pauseSVG from '@svgs/music-pause.svg';
import playSVG from '@svgs/music-play.svg';
import playlistSVG from '@svgs/music-playlist.svg';
import repeatSVG from '@svgs/music-repeat.svg';
import shuffleSVG from '@svgs/music-shuffle.svg';
import Image from 'next/image';
import React, { useCallback, useEffect, useRef, useState } from 'react';

import PlaylistDialog from '@/components/playlist-dialog';
import Track from '@/components/track';
import { TrackType } from '@/types';

interface MusicPlayerProps {
  playlist: TrackType[];
}
export default function MusicPlayer({ playlist }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [currentTrack, setCurrentTrack] = useState(0);
  const [isShuffled, setIsShuffled] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const audioRef = useRef<HTMLAudioElement>(null);

  const shufflePlaylist = useCallback(() => {
    const indices = Array.from(
      { length: playlist.length },
      (_, indice) => indice
    );
    for (let index = indices.length - 1; index > 0; index--) {
      const randomIndex = Math.floor(Math.random() * (index + 1));
      [indices[index], indices[randomIndex]] = [
        indices[randomIndex],
        indices[index],
      ];
    }
    setShuffledIndices(indices);
  }, [playlist.length]);

  useEffect(() => {
    shufflePlaylist();
  }, [shufflePlaylist]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };
  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };
  const handlePreviousTrack = () => {
    setCurrentTrack(getPreviousTrackIndex(currentTrack));
  };

  const handleNextTrack = () => {
    setCurrentTrack(getNextTrackIndex(currentTrack));
  };
  const toggleShuffle = () => {
    if (!isShuffled) {
      shufflePlaylist();
    }
    setIsShuffled(!isShuffled);
  };

  const getNextTrackIndex = (currentIndex: number) => {
    if (isShuffled) {
      const currentShuffledIndex = shuffledIndices.indexOf(currentIndex);
      return shuffledIndices[(currentShuffledIndex + 1) % playlist.length];
    }
    return (currentIndex + 1) % playlist.length;
  };

  const getPreviousTrackIndex = (currentIndex: number) => {
    if (isShuffled) {
      const currentShuffledIndex = shuffledIndices.indexOf(currentIndex);
      return shuffledIndices[
        (currentShuffledIndex - 1 + playlist.length) % playlist.length
      ];
    }
    return (currentIndex - 1 + playlist.length) % playlist.length;
  };

  return (
    <>
      <main className="flex h-20 w-full max-w-md flex-row items-center justify-center rounded-md border border-slate-200 p-2 shadow-md transition-transform hover:scale-105">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNextTrack}
        />
        <div className="flex items-center justify-between gap-10">
          <button
            onClick={handlePreviousTrack}
            className="m-2 rounded p-2 transition-colors duration-300 hover:bg-gray-200"
          >
            <Image src={backwardSVG} alt="backward" width={30} height={30} />
          </button>
          <button
            onClick={togglePlayPause}
            className="m-2 rounded p-2 transition-colors duration-300 hover:bg-gray-200"
          >
            {isPlaying ? (
              <Image src={pauseSVG} alt="pause" width={30} height={30} />
            ) : (
              <Image src={playSVG} alt="play" width={30} height={30} />
            )}
          </button>

          <button
            onClick={handleNextTrack}
            className="m-2 rounded p-2 transition-colors duration-300 hover:bg-gray-200"
          >
            <Image src={forwardSVG} alt="forward" width={30} height={30} />
          </button>
          <button
            onClick={toggleShuffle}
            className="m-2 rounded p-2 transition-colors duration-300 hover:bg-gray-200"
          >
            {isShuffled ? (
              <Image src={shuffleSVG} alt="shuffle" width={30} height={30} />
            ) : (
              <Image src={repeatSVG} alt="repeat" width={30} height={30} />
            )}
          </button>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="m-2 rounded p-2 transition-colors duration-300 hover:bg-gray-200"
          >
            <Image src={playlistSVG} alt="playlist" width={30} height={30} />
          </button>
        </div>

        <PlaylistDialog isOpen={isOpen} setIsOpen={setIsOpen} />
      </main>

      <Track
        currentTrackId={currentTrack}
        duration={duration}
        currentTime={currentTime}
      />
    </>
  );
}
