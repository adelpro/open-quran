//TODO load torrent files to the player list
'use client';

import { useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

import { PLAYLIST } from '@/constants';
import useTorrent from '@/hooks/use-torrent';
import { selectedReciterAtom } from '@/jotai/atom';

import MusicPlayer from './music-player';

export default function TorrentPlayer() {
  const { error, setError, torrentInfo } = useTorrent();
  const [webTorrentReady, setWebTorrentReady] = useState(false);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.WebTorrent) {
      console.log('WebTorrent is not available');
      return;
    }

    console.log('WebTorrent is available');
    setWebTorrentReady(true);
  }, []);

  const content = (): React.ReactNode => {
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (!webTorrentReady) {
      return <p>Loading Webtorrent...</p>;
    }

    if (!selectedReciterValue?.magnet) {
      return <p>Please select a reciter</p>;
    }

    return <p>Loading torrent...</p>;
  };

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
        strategy="afterInteractive"
        onLoad={() => {
          setWebTorrentReady(true);
        }}
        onError={() => {
          setError('Failed to load WebTorrent');
        }}
      />

      {torrentInfo ? (
        <>
          {/* TODO replace dummy playlist with real data from torrentinfo */}
          <MusicPlayer playlist={PLAYLIST} />
          <p>
            Downloaded: {(torrentInfo.downloaded / 1e6).toFixed(2)}MB | Speed:{' '}
            {(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
            {(torrentInfo.progress * 100).toFixed(1)}% | Seeders:{' '}
            {torrentInfo.seeders}
          </p>
        </>
      ) : (
        content()
      )}
    </div>
  );
}
