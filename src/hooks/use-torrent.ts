import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import type { Instance, Options, Torrent, TorrentFile } from 'webtorrent';

import { rtcConfig, TRACKERS } from '@/constants';
import { selectedReciterAtom, webtorrentReadyAtom } from '@/jotai/atom';
import { TrackType } from '@/types';
import { TorrentInfo } from '@/types/torrent-info';
import { ensureTrackerInMagnetURI, isValidMagnetUri } from '@/utils';
import { getErrorMessage } from '@/utils/get-error-message';

interface ExtendedOptions extends Options {
  rtcConfig?: RTCConfiguration;
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

    const webtorrentOptions: ExtendedOptions = {
      rtcConfig,
      tracker: { wrtc: true },
    };

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

    // Update trackers in magnet URI
    ensureTrackerInMagnetURI(magnetURI, 'wss://tracker.openwebtorrent.com');
    ensureTrackerInMagnetURI(magnetURI, 'wss://tracker.openquran.us.kg');
    ensureTrackerInMagnetURI(
      magnetURI,
      'https://tracker.openquran.us.kg/announce'
    );

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

    clientRef.current.add(magnetURI, { announce: TRACKERS });
    //clientRef.current.add(magnetURI);

    const updateTorrentInfo = async (torrent: Torrent) => {
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
    clientRef.current.torrents[0].on('ready', async () => {
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

    return () => {
      if (clientRef.current?.get(magnetURI)) {
        clientRef.current.remove(magnetURI);
      }
    };
  }, [webtorrentReady, magnetURI]);

  return { torrentInfo, error, setError };
}
