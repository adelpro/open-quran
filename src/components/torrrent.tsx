//TODO load torrent files to the player list
'use client';

import { useAtom, useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useEffect } from 'react';

import MusicPlayer from '@/components/music-player';
import { PLAYLIST } from '@/constants';
import useTorrent from '@/hooks/use-torrent';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';

import Loader from './loader';

export default function TorrentPlayer() {
  const [webtorrentReady, setWebTorrentReady] = useAtom(webtorrentReadyAtom);
  const { error, setError, torrentInfo } = useTorrent();
  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  useEffect(() => {
    if (typeof window === 'undefined' || !('WebTorrent' in window)) {
      console.log('WebTorrent is not available');
      // WebTorrent may be still loading ...
      setError(undefined);
      setWebTorrentReady(false);
      return;
    }
    console.log('WebTorrent is available');
    setError('');
    setWebTorrentReady(true);
  }, [setError, setWebTorrentReady]);

  const content = (): React.ReactNode => {
    if (error) {
      return <p>Error: {error}</p>;
    }
    if (!webtorrentReady) {
      return <Loader message="Loading Webtorrent" textClassName="text-xl" />;
    }

    if (!selectedReciterValue?.magnet) {
      return <p>Please select a reciter </p>;
    }

    return <Loader message="Loading torrent" textClassName="text-xl" />;
  };

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          setWebTorrentReady(true);
          setError(undefined);
        }}
        onError={() => {
          setError('Failed to load WebTorrent');
          setWebTorrentReady(false);
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
