import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { isValidMagnetUri } from '@/utils';
import { getErrorMessage } from '@/utils/get-error-message';

interface TorrentInfo {
  files?: TorrentFile[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
  seeders: number;
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

    clientRef.current = new window.WebTorrent({ tracker: { rtcConfig } });
    clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

    clientRef.current.on('error', (error_: unknown) =>
      setError(getErrorMessage(error_))
    );

    return () => {
      clientRef.current?.destroy();
    };
  }, []);

  // Add torrent when client is ready and a valid magnet URI exists
  useEffect(() => {
    if (!webtorrentReady || !clientRef.current || !magnetURI) return;

    setError(undefined);

    if (!isValidMagnetUri(magnetURI)) {
      setError('Invalid Magnet-URI');
      return;
    }

    clientRef.current.add(magnetURI, (torrent: Torrent) => {
      const audioFiles = torrent.files.filter((file) =>
        file.name.endsWith('.mp3')
      );
      if (audioFiles.length === 0) {
        setError('No MP3 found in torrent');
        return;
      }

      const updateProgress = () => {
        setTorrentInfo({
          files: audioFiles,
          downloaded: torrent.downloaded,
          downloadSpeed: torrent.downloadSpeed,
          uploadSpeed: torrent.uploadSpeed,
          progress: torrent.progress,
          seeders: torrent.numPeers,
        });
      };

      torrent.on('download', updateProgress);
      torrent.on('upload', updateProgress);
    });
  }, [webtorrentReady, magnetURI]);

  return { torrentInfo, error, setError };
}
