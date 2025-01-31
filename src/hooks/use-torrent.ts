import { useAtomValue } from 'jotai';
import React, { useRef, useState } from 'react';
import type { Torrent, TorrentFile, WebTorrent } from 'webtorrent';

import { selectedReciterAtom } from '@/jotai/atom';
import { isValidMagnetUri } from '@/utils';
import { getErrorMessage } from '@/utils/get-error-message';

interface TorrentInfo {
  files?: TorrentFile[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function useTorrent() {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();

  const torrentClientRef = useRef<WebTorrent | undefined>(undefined);

  const selectedReciterValue = useAtomValue(selectedReciterAtom);

  const magnetURI = selectedReciterValue ? selectedReciterValue.magnet : '';

  const initTorrent = React.useCallback(() => {
    try {
      setError(undefined);
      const client = new (window as any).WebTorrent();
      torrentClientRef.current = client;

      if (!isValidMagnetUri(magnetURI)) {
        throw new Error('Magnet URI not valid');
      }

      client.add(magnetURI, (torrent: Torrent) => {
        const audioFiles = torrent.files.filter((file) =>
          file.name.endsWith('.mp3')
        );

        /*         if (!audioFiles) {
          setError('No MP3 found in torrent');
          client.destroy();
          return;
        } */

        // Progress updates
        const updateProgress = () => {
          setTorrentInfo({
            files: audioFiles,
            downloaded: torrent.downloaded,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            progress: torrent.progress,
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

      client.on('torrent', (torrent: Torrent) => {
        console.log('Torrent metadata fetched:', torrent.files);
      });
      client.on('error', (error: unknown) => {
        setError(getErrorMessage(error));
        torrentClientRef.current = undefined;
      });
    } catch (error: unknown) {
      setError(getErrorMessage(error));
      torrentClientRef.current = undefined;
    }
  }, [magnetURI]);

  return { initTorrent, torrentInfo, error, setError };
}
