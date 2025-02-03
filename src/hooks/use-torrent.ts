import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { isValidMagnetUri } from '@/utils';
import { getErrorMessage } from '@/utils/get-error-message';

interface TorrentInfo {
  magnetURI: string;
  files?: TorrentFile[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function useTorrent() {
  const webtorrentReady = useAtomValue(webtorrentReadyAtom);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);
  const magnetURI = selectedReciterValue ? selectedReciterValue.magnet : '';
  const MAX_LISTENERS_LIMIT = 200;

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

    /*     clientRef.current = new window.WebTorrent({
      tracker: { rtcConfig },
    }); */
    clientRef.current = new window.WebTorrent();
    clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

    clientRef.current.on('torrent', (event) => {
      console.log('Torrent:', event);
    });

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
    if (clientRef.current.get(magnetURI)) {
      console.log('Torrent already added, skipping re-add.');
      return;
    }

    // Clear all other torrents
    if (
      clientRef.current?.torrents &&
      clientRef.current?.torrents?.length > 0
    ) {
      clientRef.current.torrents.forEach((torrent) => {
        if (torrent.magnetURI !== magnetURI) {
          torrent.destroy();
        }
      });
    }

    clientRef.current.add(magnetURI);

    clientRef.current.torrents[0].on('ready', () => {
      console.log('Torrent ready');
      if (clientRef?.current === null) {
        return;
      }
      setTorrentInfo(() => {
        if (clientRef.current === null) {
          return;
        }
        return {
          magnetURI: clientRef.current.torrents[0].magnetURI,
          downloaded: clientRef.current.torrents[0].downloaded,
          downloadSpeed: clientRef.current.torrents[0].downloadSpeed,
          uploadSpeed: clientRef.current.torrents[0].uploadSpeed,
          progress: clientRef.current.torrents[0].progress,
        };
      });
    });
    clientRef.current.torrents[0].on('download', () => {
      setTorrentInfo(() => {
        if (clientRef.current === null) {
          return;
        }
        return {
          magnetURI: clientRef.current.torrents[0].magnetURI,
          downloaded: clientRef.current.torrents[0].downloaded,
          downloadSpeed: clientRef.current.torrents[0].downloadSpeed,
          uploadSpeed: clientRef.current.torrents[0].uploadSpeed,
          progress: clientRef.current.torrents[0].progress,
        };
      });
    });
    clientRef.current.torrents[0].on('upload', () => {
      setTorrentInfo(() => {
        if (clientRef.current === null) {
          return;
        }
        return {
          magnetURI: clientRef.current.torrents[0].magnetURI,
          downloaded: clientRef.current.torrents[0].downloaded,
          downloadSpeed: clientRef.current.torrents[0].downloadSpeed,
          uploadSpeed: clientRef.current.torrents[0].uploadSpeed,
          progress: clientRef.current.torrents[0].progress,
        };
      });
    });
    clientRef.current.torrents[0].on('error', (error: unknown) => {
      setError(getErrorMessage(error));
      console.log('Torrent error:', error);
    });

    return () => {
      if (clientRef.current?.get(magnetURI)) {
        clientRef.current.remove(magnetURI);
      }
    };
  }, [webtorrentReady, magnetURI]);

  return { torrentInfo, error, setError };
}
