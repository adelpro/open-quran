import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { selectedReciterAtom } from '@/jotai/atom';
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
  const MAX_LISTENERS_LIMIT = 200;

  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const clientRef = useRef<Instance>(null);

  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  const magnetURI = selectedReciterValue ? selectedReciterValue.magnet : '';

  const initTorrent = useCallback(() => {
    try {
      setError(undefined);

      if (typeof window === 'undefined' || !window.WebTorrent) {
        throw new Error('WebTorrent is not available');
      }
      clientRef.current = new window.WebTorrent();
      clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

      if (!isValidMagnetUri(magnetURI)) {
        throw new Error('Magnet URI not valid');
      }
      clientRef.current.add(magnetURI, (torrent: Torrent) => {
        const audioFiles = torrent.files.filter((file) =>
          file.name.endsWith('.mp3')
        );

        console.log('audioFiles:', audioFiles);

        if (audioFiles.length === 0) {
          setError('No MP3 found in torrent');
          return;
        }

        // Progress updates
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
        torrent.on('metadata', updateProgress);
        torrent.on('infoHash', updateProgress);

        return () => {
          torrent.off('download', updateProgress);
          torrent.off('upload', updateProgress);
        };
      });

      clientRef.current.on('error', (error: unknown) => {
        setError(getErrorMessage(error));
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error));
    }
  }, [magnetURI]);

  useEffect(() => {
    if (magnetURI) {
      initTorrent();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, [magnetURI, initTorrent]);

  return { initTorrent, torrentInfo, error, setError };
}
