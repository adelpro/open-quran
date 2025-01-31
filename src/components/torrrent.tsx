'use client';

import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';
import type { Torrent, TorrentFile, WebTorrent } from 'webtorrent';

import { getErrorMessage } from '@/utils/get-error-message';

type Props = {
  magnetURI: string;
};

interface TorrentInfo {
  file?: TorrentFile;
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function TorrentPlayer({ magnetURI }: Props) {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const torrentClientRef = useRef<WebTorrent | undefined>(undefined);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const initTorrent = React.useCallback(() => {
    try {
      setError(undefined);
      const client = new (window as any).WebTorrent();
      torrentClientRef.current = client;

      console.log('WebTorrent available:', window.WebTorrent);
      client.add(magnetURI, (torrent: Torrent) => {
        console.log('initTorrent - 1');
        const audioFile = torrent.files.find((file) =>
          file.name.endsWith('.mp3')
        );

        if (!audioFile) {
          setError('No MP3 found in torrent');
          client.destroy();
          return;
        }

        // In your torrent handler
        if (audioRef.current) {
          audioFile.renderTo(audioRef.current, {
            autoplay: true,
            controls: true,
          });
        }

        // Progress updates
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
        updateProgress();

        return () => {
          torrent.off('download', updateProgress);
          torrent.off('upload', updateProgress);
        };
      });
      console.log('initTorrent - 2');
      client.on('torrent', (torrent: Torrent) => {
        console.log('Torrent metadata fetched:', torrent.name);
      });
      client.on('error', (error: Error) => {
        setError(getErrorMessage(error));
      });
    } catch (error_) {
      setError(getErrorMessage(error_));
    }
  }, [magnetURI]);

  useEffect(() => {
    if (scriptLoaded) initTorrent();
    return () => {
      torrentClientRef.current = undefined;
    };
  }, [scriptLoaded, initTorrent]);

  return (
    <div className="my-2.5 rounded bg-gray-100 p-2.5">
      <Script
        src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
        strategy="lazyOnload"
        onLoad={() => setScriptLoaded(true)}
        onError={() => setError('Failed to load WebTorrent')}
      />

      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : torrentInfo ? (
        <p>
          Downloaded: {(torrentInfo.downloaded / 1e6).toFixed(2)}MB | Speed:{' '}
          {(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
          {(torrentInfo.progress * 100).toFixed(1)}%
        </p>
      ) : (
        <>
          <p>{scriptLoaded ? 'Loading torrent...' : 'Loading WebTorrent...'}</p>
          <audio ref={audioRef} className="mt-2 w-full" />
        </>
      )}
    </div>
  );
}
