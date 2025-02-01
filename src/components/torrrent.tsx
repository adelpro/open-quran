//TODO load torrent files to the player list
'use client';

import { useAtomValue } from 'jotai';
import Script from 'next/script';
import React, { useEffect, useState } from 'react';

import { playlist } from '@/constants';
import useTorrent from '@/hooks/use-torrent';
import { selectedReciterAtom } from '@/jotai/atom';

import MusicPlayer from './music-player';

export default function TorrentPlayer() {
  const { error, setError, torrentInfo } = useTorrent();
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  /*   useEffect(() => {
    console.table([torrentInfo?.files, error, scriptLoaded]);
  }, [error, scriptLoaded, torrentInfo]); */
  if (!selectedReciterValue?.magnet) {
    return <p>Please select a reciter</p>;
  }

  return (
    <div className="flex flex-col gap-2">
      <Script
        src="https://cdn.jsdelivr.net/npm/webtorrent@latest/webtorrent.min.js"
        strategy="lazyOnload"
        onLoad={() => {
          setScriptLoaded(true);
        }}
        onError={() => {
          setError('Failed to load WebTorrent');
        }}
      />

      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : torrentInfo ? (
        <>
          {/* TODO replace dummy playlist with real data from torrentinfo */}
          <MusicPlayer playlist={playlist} />
          <p>
            Downloaded: {(torrentInfo.downloaded / 1e6).toFixed(2)}MB | Speed:{' '}
            {(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
            {(torrentInfo.progress * 100).toFixed(1)}%
          </p>
        </>
      ) : (
        <p>{scriptLoaded ? 'Loading torrent...' : 'Loading WebTorrent...'}</p>
      )}
    </div>
  );
}
