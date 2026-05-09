import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig, TRACKERS } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { TorrentInfo, TrackType } from '@/types';
import {
  clientConfig,
  getErrorMessage,
  isValidMagnetUri,
  updateMagnetURI,
} from '@/utils';

const TORRENT_READY_TIMEOUT = 120_000; // 2 min

const isDebug = clientConfig.DEBUG;
const debugLog = (...arguments_: any[]) => {
  if (isDebug) console.log(...arguments_);
};
const debugError = (...arguments_: any[]) => {
  if (isDebug) console.error(...arguments_);
};

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
        maxConns: 1000,
        tracker: { rtcConfig },
      });
      debugLog(
        '[Torrent Lifecycle] WebTorrent client initialized successfully'
      );
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

    // Extract infoHash for stable identity comparison.
    // WebTorrent reformats torrent.magnetURI internally, so string equality
    // against our magnet URI is unreliable and causes an infinite destroy loop.
    const infoHashMatch = updatedMagnetURI.match(
      /xt=urn:btih:([A-Fa-f0-9]{40}|[A-Z2-7]{32})/i
    );
    const infoHash = infoHashMatch?.[1]?.toLowerCase() ?? null;

    // Destroy any torrents that are NOT the one we want
    for (const t of localClient.torrents) {
      if (t.infoHash !== infoHash) {
        debugLog(`[Torrent Lifecycle] Destroying old torrent: ${t.infoHash}`);
        t.destroy();
      }
    }

    let torrent = infoHash ? localClient.get(infoHash) : null;
    if (torrent) {
      debugLog(
        `[Torrent Lifecycle] Torrent already exists in client, reusing.`
      );
    } else {
      debugLog(
        `[Torrent Lifecycle] Adding new torrent to client: ${updatedMagnetURI}`
      );
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
      debugLog(
        '[Torrent Lifecycle] Torrent metadata ready, starting processing'
      );
      clearTimeout(readyTimeout);
      setError(undefined);
      updateTorrentInfoState();
    };

    const onNoPeers = (announceType: string) => {
      debugLog(
        `[Torrent Lifecycle] Warning: No peers found for ${announceType} trackers`
      );
      const message = `No peers found for ${announceType} trackers. Please check your internet connection or try again later.`;
      setError(message);
    };

    const onError = (torrentError: Error) => {
      debugError('[Torrent Lifecycle] Torrent error:', torrentError);
      clearTimeout(readyTimeout);
      setError(getErrorMessage(torrentError));
    };

    const onWire = () => {
      debugLog(
        `[Torrent Lifecycle] New peer connected. Total peers: ${torrent.numPeers}`
      );
      updateTorrentInfoState();
    };

    torrent.on('ready', onReady);
    torrent.on('download', updateTorrentInfoState);
    torrent.on('wire', onWire);
    torrent.on('noPeers', onNoPeers);
    //torrent.on('error', onError);

    return () => {
      clearTimeout(readyTimeout);
      torrent.removeListener('ready', onReady);
      torrent.removeListener('download', updateTorrentInfoState);
      torrent.removeListener('wire', onWire);
      torrent.removeListener('noPeers', onNoPeers);
      torrent.removeListener('error', onError);
    };
  }, [magnetURI, webtorrentReady]);

  return { torrentInfo, error, setError };
}
