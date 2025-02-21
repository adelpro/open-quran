import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig, TRACKERS } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { TorrentInfo, TrackType } from '@/types';
import { getErrorMessage, isValidMagnetUri } from '@/utils';

//const TORRENT_TIMEOUT = 300_000; // 5 minutes
const MAX_LISTENERS_LIMIT = 100;

const getCircularReplacer = () => {
  const seen = new WeakSet();
  return (key: string, value: any) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    return value;
  };
};

export default function useTorrent() {
  const webtorrentReady = useAtomValue(webtorrentReadyAtom);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);
  const magnetURI = selectedReciterValue ? selectedReciterValue.magnet : '';

  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const clientRef = useRef<Instance | null>(null);

  // Initialize WebTorrent client once on mount
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    if (!webtorrentReady || !window.WebTorrent) {
      return;
    }

    const webtorrentOptions = {
      tracker: {
        announce: TRACKERS,
        rtcConfig,
      },
    };

    // Check for WebRTC support
    if (!window.WebTorrent.WEBRTC_SUPPORT) {
      setError('WebTorrent does not support WebRTC');
    }

    clientRef.current = new window.WebTorrent(webtorrentOptions);

    clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

    clientRef.current.on('error', (error_: unknown) =>
      setError(getErrorMessage(error_))
    );

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
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

    // Check if torrent is already added
    const existingTorrent = clientRef.current.get(magnetURI);
    if (existingTorrent) {
      console.log(
        `Torrent already added (${existingTorrent.name}), skipping re-add.`
      );
      return;
    }

    // Clear all other torrents
    if (
      clientRef.current?.torrents &&
      clientRef.current?.torrents?.length > 0
    ) {
      for (const torrent of clientRef.current.torrents) {
        if (torrent.magnetURI !== magnetURI) {
          torrent.destroy();
        }
      }
    }

    const torrentOptions = {
      announce: TRACKERS,
    };
    clientRef.current.add(magnetURI, torrentOptions);

    const updateTorrentInfo = async (torrent: Torrent) => {
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
          const blobUrl = await new Promise<string>((resolve, reject) => {
            file.getBlob((error_, blob) => {
              if (error_ || !blob) {
                reject(error_);
              } else {
                resolve(URL.createObjectURL(blob));
              }
            });
          });
          return { surahId, link: blobUrl };
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
    if (clientRef?.current === null) {
      return;
    }

    // Add timeout handling
    const destroyClient = () => {
      if (clientRef.current) {
        for (const torrent of clientRef.current?.torrents) torrent.destroy();
        clientRef.current?.destroy();

        // eslint-disable-next-line unicorn/no-null
        clientRef.current = null;
      }
    };

    /*     const timeout = setTimeout(() => {
      setError('Torrent initialization timeout');
      destroyClient();
    }, TORRENT_TIMEOUT); */

    const torrentInstance = clientRef.current.torrents[0];
    if (torrentInstance) {
      torrentInstance.on('ready', async () => {
        //clearTimeout(timeout);
        if (clientRef.current) {
          await updateTorrentInfo(clientRef.current.torrents[0]);
        }
      });
      clientRef.current.torrents[0].on('download', async () => {
        if (clientRef.current) {
          await updateTorrentInfo(clientRef.current.torrents[0]);
        }
      });
      clientRef.current.torrents[0].on('upload', async () => {
        if (clientRef.current) {
          await updateTorrentInfo(clientRef.current.torrents[0]);
        }
      });
      clientRef.current.torrents[0].on('error', (error: unknown) => {
        setError(getErrorMessage(error));
        console.log('Torrent error:', error);
      });
      clientRef.current.torrents[0].on('warning', (error: unknown) => {
        setError(getErrorMessage(error));
        console.log('Torrent warning:', error);
      });
    }

    return () => {
      if (clientRef.current?.get(magnetURI)) {
        clientRef.current.remove(magnetURI);
      }
    };
  }, [webtorrentReady, magnetURI]);

  return { torrentInfo, error, setError };
}
