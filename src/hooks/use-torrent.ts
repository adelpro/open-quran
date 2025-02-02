import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { selectedReciterAtom } from '@/jotai/atom';
import { isValidMagnetUri } from '@/utils';
import { ensureTrackerInMagnetURI } from '@/utils/ensure-tracker-in-magnet-uri';
import { getErrorMessage } from '@/utils/get-error-message';

interface TorrentInfo {
  files?: TorrentFile[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
  seeders: number;
}

export default function useTorrent(webtorrentReady: boolean) {
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
        console.error('Invalid magnet URI:', magnetURI);
        throw new Error('Magnet URI not valid');
      }
      const updatedMagnetURI = ensureTrackerInMagnetURI(
        magnetURI,
        'wws://tracker.openbittorrent.com:80'
      );
      clientRef.current.add(updatedMagnetURI, (torrent: Torrent) => {
        console.log('Torrent added successfully:', torrent);

        const audioFiles = torrent.files.filter((file) =>
          file.name.endsWith('.mp3')
        );
        console.log('Audio files in torrent:', audioFiles);

        if (audioFiles.length === 0) {
          setError('No MP3 found in torrent');
          return;
        }

        // Progress updates
        const updateProgress = (event: any) => {
          console.log('Progress update:', event);
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

        return () => {
          torrent.off('download', updateProgress);
          torrent.off('upload', updateProgress);
        };
      });

      clientRef.current.on('torrent', (torrent: Torrent) => {
        console.log('torrent from client  on torrent:', torrent);
      });

      clientRef.current.on('error', (error: unknown) => {
        setError(getErrorMessage(error));
      });
    } catch (error: unknown) {
      console.error('Error initializing torrent:', error);
      setError(getErrorMessage(error));
    }
  }, [magnetURI]);

  useEffect(() => {
    console.log('use-torrent - webtorrentReady:', webtorrentReady);
    console.log('use-torrent - magnetURI:', magnetURI);
    if (webtorrentReady && magnetURI) {
      initTorrent();
    }

    return () => {
      if (clientRef.current) {
        clientRef.current.destroy();
      }
    };
  }, [magnetURI, initTorrent, webtorrentReady]);

  return { torrentInfo, error, setError };
}
