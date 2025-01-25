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
import TrackInfo from '@/components/track-info';
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
    if (!audioRef.current) {
      return;
    }

    if (!Number.isNaN(audioRef.current.duration)) {
      setDuration(audioRef.current.duration);
    }

    if (!Number.isNaN(audioRef.current.currentTime)) {
      setCurrentTime(audioRef.current.currentTime);
    }

    if (audioRef.current.ended) {
      handleNextTrack();
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
      <main className="flex h-20 w-full max-w-md flex-col items-center justify-center rounded-t-md border border-slate-200 p-0 shadow-md transition-transform hover:scale-105">
        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onDurationChange={handleTimeUpdate}
          onEnded={handleNextTrack}
          src={playlist[currentTrack]?.link}
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
        <div className="inset-0 flex h-1 w-full items-center justify-between">
          <progress
            className="insert-0 mt-5 h-1 w-full"
            max={duration}
            value={currentTime}
            //style={{ color: '#0091e1' }}
          />
        </div>
        <PlaylistDialog
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setCurrentTrack={setCurrentTrack}
        />
      </main>

      <TrackInfo
        currentTrackId={currentTrack}
        duration={duration}
        currentTime={currentTime}
      />
    </>
  );
}
