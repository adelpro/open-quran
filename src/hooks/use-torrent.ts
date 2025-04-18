import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig, TRACKERS } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { TorrentInfo, TrackType } from '@/types';
import {
  getCircularReplacer,
  getErrorMessage,
  isValidMagnetUri,
  updateMagnetURI,
} from '@/utils';

//const TORRENT_TIMEOUT = 300_000; // 5 minutes
const MAX_LISTENERS_LIMIT = 100;

export default function useTorrent() {
  const webtorrentReady = useAtomValue(webtorrentReadyAtom);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);
  const magnetURI = selectedReciterValue?.magnet || undefined;

  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const clientRef = useRef<Instance | undefined>(undefined);

  // Initialize WebTorrent client once on mount
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !webtorrentReady ||
      !window.WebTorrent
    ) {
      return;
    }

    // Check for WebRTC support
    if (!window.WebTorrent?.WEBRTC_SUPPORT) {
      setError('WebTorrent does not support WebRTC');
    }
    const trackerOptions = {
      announce: TRACKERS,
      rtcConfig: rtcConfig,
    };
    clientRef.current = new window.WebTorrent({
      tracker: trackerOptions,
    });

    clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

    clientRef.current.on('error', (error: unknown) =>
      setError(getErrorMessage(error))
    );

    clientRef.current.on('torrent', (torrent: Torrent) =>
      console.log('Client torrent:', torrent)
    );

    return () => {
      clientRef.current?.destroy();
      clientRef.current = undefined;
    };
  }, [webtorrentReady]);

  // Add torrent when client is ready and a valid magnet URI exists
  useEffect(() => {
    //Reset states
    setTorrentInfo(undefined);
    setError(undefined);

    if (!magnetURI) {
      return;
    }

    if (!webtorrentReady || !clientRef.current) {
      setError('Webtorrent is not ready');
      return;
    }

    // Check if magnet URI is valid
    if (!isValidMagnetUri(magnetURI)) {
      setError('Invalid Magnet-URI');
      return;
    }

    const updatedMagnetURI = updateMagnetURI(magnetURI);

    // Clean up any other torrents before adding the new one
    for (const torrent of clientRef.current.torrents) {
      if (torrent.magnetURI !== updatedMagnetURI) torrent.destroy();
    }

    const torrentOptions = {
      announce: TRACKERS,
    };

    clientRef.current.add(updatedMagnetURI, torrentOptions, async (torrent) => {
      await updateTorrentInfo(torrent);

      // Add event listeners to keep torrent info updated
      torrent.on('ready', () => updateTorrentInfo(torrent));
      torrent.on('download', () => updateTorrentInfo(torrent));
      torrent.on('wire', () => updateTorrentInfo(torrent));
      torrent.on('error', (error_) => setError(getErrorMessage(error_)));
    });

    const updateTorrentInfo = async (torrent: Torrent) => {
      setTorrentInfo(undefined);
      setError(undefined);

      console.log(
        'Torrent added',
        JSON.stringify(torrent, getCircularReplacer(), 2)
      );
      const mp3Files = torrent.files.filter((file: TorrentFile) =>
        file.name.endsWith('.mp3')
      );
      const playlist: TrackType[] = await Promise.all(
        mp3Files.map(async (file: TorrentFile) => {
          const surahId = Number(file.name.split('.')[0]);
          const blobURL = await new Promise<string>((resolve, reject) => {
            file.getBlobURL((error, blob) => {
              if (error || !blob) {
                reject(error);
              } else {
                resolve(blob);
              }
            });
          });
          return { surahId, link: blobURL };
        })
      );

      setTorrentInfo({
        magnetURI: torrent.magnetURI,
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        progress: torrent.progress,
        peers: torrent.numPeers,
        files: playlist,
        ready: torrent.ready,
      });
    };

    // Check if torrent is already added
    const existingTorrent = clientRef.current.get(updatedMagnetURI);
    if (existingTorrent) {
      console.log(
        `Torrent already added (${existingTorrent.name}), updating info...`
      );
      // Update info for existing torrent instead of skipping
      updateTorrentInfo(existingTorrent);
      return;
    }

    /*  const torrentInstance = clientRef.current.torrents[0];
    if (torrentInstance) {
      torrentInstance.on('ready', async () => {
        await updateTorrentInfo(torrentInstance);
      });
      torrentInstance.on('download', async () => {
        await updateTorrentInfo(torrentInstance);
      });
      torrentInstance.on('upload', async () => {
        await updateTorrentInfo(torrentInstance);
      });
      torrentInstance.on('error', (error: unknown) => {
        setError(getErrorMessage(error));
        console.log('Torrent error:', error);
      });
      torrentInstance.on('warning', (error: unknown) => {
        setError(getErrorMessage(error));
        console.log('Torrent warning:', error);
      });
    }
 */
    return () => {
      clientRef.current?.remove(updatedMagnetURI);
    };
  }, [magnetURI, webtorrentReady]);

  return { torrentInfo, error, setError };
}
