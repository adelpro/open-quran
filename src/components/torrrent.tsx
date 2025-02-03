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

    if (torrentInfo === undefined) {
      return <Loader message="Loading torrent" textClassName="text-xl" />;
    }

    return (
      <>
        {/* TODO replace dummy playlist with real data from torrentinfo */}
        <MusicPlayer playlist={PLAYLIST} />
        <p>
          Downloaded: {(torrentInfo?.downloaded / 1e6).toFixed(2)}MB | Speed:{' '}
          {(torrentInfo?.downloadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
          {(torrentInfo?.progress * 100).toFixed(1)}% | Seeders:{' '}
          {torrentInfo?.seeders}
        </p>
      </>
    );
  };

  return (
    <div className="flex flex-col gap-2">
      {webtorrentReady ? (
        <></>
      ) : (
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
      )}
      {content()}
    </div>
  );
}
