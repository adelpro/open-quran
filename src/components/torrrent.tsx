//TODO load torrent files to the player list
'use client';

import { useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useEffect, useRef, useState } from 'react';
import type { Torrent, TorrentFile, WebTorrent } from 'webtorrent';

import { selectedReciterAtom } from '@/jotai/atom';
import { isValidMagnetUri } from '@/utils';
import { getErrorMessage } from '@/utils/get-error-message';

interface TorrentInfo {
  file?: TorrentFile;
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function TorrentPlayer() {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const [scriptLoaded, setScriptLoaded] = useState(false);

  const torrentClientRef = useRef<WebTorrent | undefined>(undefined);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  const magnetURI = selectedReciterValue ? selectedReciterValue.magnet : '';

  const initTorrent = React.useCallback(() => {
    try {
      setError(undefined);
      const client = new (window as any).WebTorrent();
      torrentClientRef.current = client;

      client.add(magnetURI, (torrent: Torrent) => {
        const audioFile = torrent.files.find((file) =>
          file.name.endsWith('.mp3')
        );

        console.log('audio files', audioRef);

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

        return () => {
          torrent.off('download', updateProgress);
          torrent.off('upload', updateProgress);
        };
      });

      client.on('torrent', (torrent: Torrent) => {
        console.log('Torrent metadata fetched:', torrent.files);
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

  if (magnetURI === undefined) {
    return <p> magnetURI undefined</p>;
  }

  if (!isValidMagnetUri(magnetURI)) {
    return <p>magnetURI Unvalid</p>;
  }

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
