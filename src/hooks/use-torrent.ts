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
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize WebTorrent client once on mount
  useEffect(() => {
    if (
      typeof window === 'undefined' ||
      !webtorrentReady ||
      !window.WebTorrent
    ) {
      return;
    }

    if (!window.WebTorrent?.WEBRTC_SUPPORT) {
      setError('WebTorrent does not support WebRTC');
      // Do not return here, client can still be useful for non-WebRTC peers or WebSeeds
    }
    const trackerOptions = {
      announce: TRACKERS,
      rtcConfig: rtcConfig,
    };
    clientRef.current = new window.WebTorrent({
      tracker: trackerOptions,
    });

    clientRef.current.setMaxListeners(MAX_LISTENERS_LIMIT);

    clientRef.current.on('error', (clientError: unknown) => {
      console.error('WebTorrent client error:', clientError);
      setError(getErrorMessage(clientError));
    });

    // clientRef.current.on('torrent', (torrent: Torrent) =>
    //   console.log('Client event: torrent added or processed', torrent.name || torrent.infoHash)
    // );

    return () => {
      console.log('Destroying WebTorrent client');
      clientRef.current?.destroy();
      clientRef.current = undefined;
    };
  }, [webtorrentReady]);

  // Add torrent when client is ready and a valid magnet URI exists
  useEffect(() => {
    setTorrentInfo(undefined);
    setError(undefined); // Reset error state when magnetURI or readiness changes

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

    // Clean up any other torrents before adding/processing the new one
    for (const torrent of localClient.torrents) {
      if (
        torrent.magnetURI !== updatedMagnetURI &&
        torrent.infoHash !== updatedMagnetURI
      ) {
        console.log(
          `Destroying unrelated torrent: ${torrent.name || torrent.infoHash}`
        );
        torrent.destroy();
      }
    }

    const torrentOptions = {
      announce: TRACKERS, // Ensure trackers are passed if needed for .add
    };

    const updateTorrentInfoState = async (torrent: Torrent) => {
      // console.log(`Updating torrent info for: ${torrent.name || torrent.infoHash}, Ready: ${torrent.ready}, Peers: ${torrent.numPeers}`);
      const mp3Files = torrent.files.filter((file: TorrentFile) =>
        file.name.endsWith('.mp3')
      );

      const playlist: TrackType[] = await Promise.all(
        mp3Files.map(async (file: TorrentFile) => {
          const surahId = Number(file.name.split('.')[0]);
          if (typeof file.getBlobURL !== 'function') {
            console.error(`File ${file.name} does not have getBlobURL method.`);
            return { surahId, link: '' };
          }
          try {
            const blobURL = await new Promise<string>((resolve, reject) => {
              file.getBlobURL((error_, blob) => {
                if (error_ || !blob) {
                  console.error(
                    `Error getting blob URL for ${file.name}:`,
                    error_
                  );
                  reject(error_ || new Error('Blob URL is null or undefined'));
                } else {
                  resolve(blob);
                }
              });
            });
            return { surahId, link: blobURL };
          } catch (error_) {
            console.error(
              `Promise rejected for getBlobURL on ${file.name}:`,
              error_
            );
            return { surahId, link: '' };
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
        files: playlist.filter((p) => p.link), // Filter out tracks that failed to get a link
        ready: torrent.ready,
      });
    };

    const attachEventListenersAndProcess = async (torrentInstance: Torrent) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }

      if ((torrentInstance as any).__listenersAttached) {
        // console.log(`Listeners already attached to ${torrentInstance.name || torrentInstance.infoHash}, just updating info.`);
        await updateTorrentInfoState(torrentInstance);
        return;
      }

      console.log(
        `Attaching listeners and processing torrent: ${torrentInstance.name || torrentInstance.infoHash}`
      );
      await updateTorrentInfoState(torrentInstance); // Initial info update

      // Remove all existing listeners of specific types to prevent duplicates
      torrentInstance.removeAllListeners('ready');
      torrentInstance.removeAllListeners('download');
      torrentInstance.removeAllListeners('wire');
      torrentInstance.removeAllListeners('noPeers');
      torrentInstance.removeAllListeners('error');

      torrentInstance.on('ready', () => {
        console.log(
          `Torrent ready: ${torrentInstance.name || torrentInstance.infoHash}`
        );
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setError(undefined); // Clear errors when torrent is ready
        updateTorrentInfoState(torrentInstance);
      });

      torrentInstance.on('download', (_bytes: number) => {
        // console.log(`Torrent download: ${_bytes} bytes for ${torrentInstance.name || torrentInstance.infoHash}`);
        updateTorrentInfoState(torrentInstance);
      });

      torrentInstance.on('wire', () => {
        // console.log(`Torrent wire event for ${torrentInstance.name || torrentInstance.infoHash}`);
        updateTorrentInfoState(torrentInstance);
      });

      torrentInstance.on('noPeers', (announceType) => {
        console.warn(
          `No peers found for ${announceType} trackers on torrent ${torrentInstance.name || torrentInstance.infoHash}.`
        );
        // Optionally set a non-fatal error or warning message
        // setError(`Warning: No peers found via ${announceType}. Trying other trackers/sources.`);
      });

      torrentInstance.on('error', (torrentError) => {
        console.error(
          `Torrent error on ${torrentInstance.name || torrentInstance.infoHash}:`,
          torrentError
        );
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        setError(getErrorMessage(torrentError));
        // updateTorrentInfoState(torrentInstance); // Update info even on error to reflect state
      });

      (torrentInstance as any).__listenersAttached = true;
    };

    const existingTorrent = localClient.get(updatedMagnetURI);
    if (existingTorrent) {
      console.log(
        `Torrent already in client (${existingTorrent.name || existingTorrent.infoHash}), processing...`
      );
      attachEventListenersAndProcess(existingTorrent);
    } else {
      console.log(`Adding new torrent: ${updatedMagnetURI}`);
      // Set a timeout for the add operation itself
      // timeoutRef.current = setTimeout(() => {
      //   setError('Timeout: Adding torrent took too long.');
      //   console.error('Timeout adding torrent:', updatedMagnetURI);
      // }, TORRENT_TIMEOUT); // TORRENT_TIMEOUT needs to be defined

      localClient.add(updatedMagnetURI, torrentOptions, (newTorrent) => {
        console.log(
          `Callback for new torrent add: ${newTorrent.name || newTorrent.infoHash}`
        );
        // Clear add timeout if it was set
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
          timeoutRef.current = null;
        }
        attachEventListenersAndProcess(newTorrent);
      });
    }

    return () => {
      // This cleanup runs when magnetURI/webtorrentReady changes, or component unmounts.
      // It should clean up the torrent associated with the *current* updatedMagnetURI from this effect's closure.
      if (clientRef.current) {
        // Ensure client still exists
        const torrentToClean = clientRef.current.get(updatedMagnetURI);
        if (torrentToClean) {
          console.log(
            `Cleaning up torrent from effect: ${torrentToClean.name || torrentToClean.infoHash}`
          );
          (torrentToClean as any).__listenersAttached = false; // Reset flag
          torrentToClean.destroy(); // destroy() also removes it from the client and listeners
        }
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };
  }, [magnetURI, webtorrentReady, setError, setTorrentInfo]); // Added setError and setTorrentInfo as they are used in effect-defined functions

  return { torrentInfo, error, setError };
}
