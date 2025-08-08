import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig, TRACKERS } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { TorrentInfo, TrackType } from '@/types';
import { getErrorMessage, isValidMagnetUri, updateMagnetURI } from '@/utils';

const TORRENT_READY_TIMEOUT = 60_000; // 1 min

export default function useTorrent() {
  const webtorrentReady = useAtomValue(webtorrentReadyAtom);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);
  const magnetURI = selectedReciterValue?.magnet || undefined;

  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | undefined>();
  const [error, setError] = useState<string | undefined>();
  const clientRef = useRef<Instance | undefined>(undefined);

  // Initialize WebTorrent client once on mount
  useEffect(() => {
    if (webtorrentReady && !clientRef.current && window.WebTorrent) {
      clientRef.current = new window.WebTorrent({
        tracker: { rtcConfig },
      });
    }
  }, [webtorrentReady]);

  // Add torrent when client is ready and a valid magnet URI exists
  useEffect(() => {
    setTorrentInfo(undefined);
    setError(undefined);

    if (!magnetURI) {
      return;
    }

    if (!webtorrentReady || !clientRef.current) {
      setError('WebTorrent client is not ready.');
      return;
    }

    if (!isValidMagnetUri(magnetURI)) {
      setError('Invalid Magnet-URI provided.');
      return;
    }

    const localClient = clientRef.current;
    const updatedMagnetURI = updateMagnetURI(magnetURI);

    // Clean up any other torrents
    for (const t of localClient.torrents) {
      if (t.magnetURI !== updatedMagnetURI) {
        t.destroy();
      }
    }

    let torrent = localClient.get(updatedMagnetURI);
    if (!torrent) {
      torrent = localClient.add(updatedMagnetURI, { announce: TRACKERS });
    }

    const updateTorrentInfoState = async () => {
      const mp3Files = torrent.files.filter((file: TorrentFile) =>
        file.name.endsWith('.mp3')
      );

      const playlist: TrackType[] = await Promise.all(
        mp3Files.map(async (file: TorrentFile) => {
          const surahId = Number(file.name.split('.')[0]);
          try {
            const blobURL = await new Promise<string>((resolve, reject) => {
              file.getBlobURL((error, blob) => {
                if (error || !blob) {
                  reject(error || new Error('Blob URL is null or undefined'));
                } else {
                  resolve(blob);
                }
              });
            });
            return { surahId, link: blobURL };
          } catch (error) {
            const errorMessage = getErrorMessage(error);
            return { surahId, link: '', error: errorMessage };
          }
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

    updateTorrentInfoState();

    const readyTimeout = setTimeout(() => {
      if (!torrent.ready) {
        setError(
          'Timeout: Could not fetch torrent metadata. Please try again later.'
        );
      }
    }, TORRENT_READY_TIMEOUT);

    const onReady = () => {
      clearTimeout(readyTimeout);
      setError(undefined);
      updateTorrentInfoState();
    };

    const onNoPeers = (announceType: string) => {
      const message = `No peers found for ${announceType} trackers. Please check your internet connection or try again later.`;
      setError(message);
    };

    const onError = (torrentError: Error) => {
      clearTimeout(readyTimeout);
      setError(getErrorMessage(torrentError));
    };

    torrent.on('ready', onReady);
    torrent.on('download', updateTorrentInfoState);
    torrent.on('wire', updateTorrentInfoState);
    torrent.on('noPeers', onNoPeers);
    //torrent.on('error', onError);

    return () => {
      clearTimeout(readyTimeout);
      torrent.removeListener('ready', onReady);
      torrent.removeListener('download', updateTorrentInfoState);
      torrent.removeListener('wire', updateTorrentInfoState);
      torrent.removeListener('noPeers', onNoPeers);
      torrent.removeListener('error', onError);
    };
  }, [magnetURI, webtorrentReady]);

  return { torrentInfo, error, setError };
}
