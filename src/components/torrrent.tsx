'use client';

import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';
import { type Torrent, type TorrentFile } from 'webtorrent';

import { getErrorMessage } from '@/utils/get-error-message';

type Props = {
  magnetURI: string;
};

interface TorrentInfo {
  file?: any;
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function Torrent({ magnetURI }: Props) {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | null>();
  const [error, setError] = useState<string | null>();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const torrentClientRef = useRef<any>(null);

  const initTorrent = React.useCallback(() => {
    if (typeof window === 'undefined' || !('WebTorrent' in window)) {
      return;
    }
    try {
      const torrentClient = new window.WebTorrent();
      torrentClientRef.current = torrentClient;
      console.log('torrentClient - 1');
      torrentClient.add(magnetURI, (torrent: Torrent) => {
        console.log('Client is downloading:', torrent.infoHash);

        const audioFile = torrent.files.find((file: TorrentFile) =>
          file.name.endsWith('.mp3')
        );

        if (!audioFile) {
          setError('No MP3 file found in torrent.');
          return;
        }

        // Stream the audio file
        if (audioRef.current) {
          audioFile.renderTo(audioRef.current, { autoplay: true });
        }

        // Update progress periodically
        const updateProgress = () => {
          setTorrentInfo({
            file: audioFile,
            downloaded: torrent.downloaded,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            progress: torrent.progress,
          });
        };

        torrent.on('download', updateProgress);
        torrent.on('upload', updateProgress);
        updateProgress(); // Initial update
      });
      console.log('torrentClient - 2');
      torrentClient.on('error', (error: unknown) => {
        const message = getErrorMessage(error);
        console.error('Torrent error:', message);
        setError(message);
      });
    } catch (error: unknown) {
      const message = getErrorMessage(error);

      setError(message);
      console.log('error:', message);
    }
  }, [magnetURI]);

  useEffect(() => {
    if (scriptLoaded && !torrentClientRef.current) {
      initTorrent();
    }

    return () => {
      if (torrentClientRef.current) {
        torrentClientRef.current.destroy();
        torrentClientRef.current = undefined;
      }
    };
  }, [scriptLoaded, magnetURI, initTorrent]);

  return (
    <>
      <Script
        src="https://cdnjs.cloudflare.com/ajax/libs/webtorrent/1.9.7/webtorrent.min.js"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError('Failed to load WebTorrent script')}
      />

      <div className="my-2.5 rounded bg-gray-100 p-2.5">
        {error ? (
          <p className="text-red-500">Error: {error}</p>
        ) : torrentInfo ? (
          <p>
            Downloaded: {(torrentInfo.downloaded / 1024 / 1024).toFixed(2)}MB |
            Speed: {(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Upload:{' '}
            {(torrentInfo.uploadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
            {(torrentInfo.progress * 100).toFixed(1)}%
          </p>
        ) : (
          <p>Loading torrent...</p>
        )}
        {/* <audio ref={audioRef} controls className="mt-2 w-full" /> */}
      </div>
    </>
  );
}
