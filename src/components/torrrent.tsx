'use client';
import React, { useEffect, useRef, useState } from 'react';
import WebTorrent, { type Torrent, type TorrentFile } from 'webtorrent';

type Props = {
  magnetURI: string;
};

interface TorrentInfo {
  file?: TorrentFile;
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function Torrent({ magnetURI }: Props) {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo | null>();
  const [error, setError] = useState<string | null>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const torrentClientRef = useRef<WebTorrent.Instance | null>(null);

  useEffect(() => {
    const torrentClient = new WebTorrent();
    torrentClientRef.current = torrentClient;

    try {
      torrentClient.add(magnetURI, (torrent: Torrent) => {
        console.log('Client is downloading:', torrent.infoHash);

        const audioFile = torrent.files.find((file) =>
          file.name.endsWith('.mp3')
        );
        if (!audioFile) {
          setError('No MP3 file found in torrent.');
          return;
        }

        // Stream the audio file
        if (audioRef.current) {
          audioFile.renderTo(audioRef.current, { autoplay: true });
        }

        // Update progress periodically
        const updateProgress = () => {
          setTorrentInfo({
            file: audioFile,
            downloaded: torrent.downloaded,
            downloadSpeed: torrent.downloadSpeed,
            uploadSpeed: torrent.uploadSpeed,
            progress: torrent.progress,
          });
        };

        torrent.on('download', updateProgress);
        torrent.on('upload', updateProgress);

        updateProgress(); // Initial update
      });

      // Handle errors
      torrentClient.on('error', (error) => {
        console.error('Torrent error:', error);
        setError((error as Error).message);
      });
    } catch (error) {
      setError((error as Error).message);
    }

    return () => {
      torrentClient.destroy();
    };
  }, [magnetURI]);

  return (
    <div className="my-2.5 rounded bg-gray-100 p-2.5">
      {error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : torrentInfo ? (
        <p>
          Downloaded: {(torrentInfo.downloaded / 1024 / 1024).toFixed(2)}MB |
          Speed: {(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Upload:{' '}
          {(torrentInfo.uploadSpeed / 1024).toFixed(2)}KB/s | Progress:{' '}
          {(torrentInfo.progress * 100).toFixed(1)}%
        </p>
      ) : (
        <p>Loading torrent...</p>
      )}
      <audio ref={audioRef} controls className="mt-2 w-full" />
    </div>
  );
}
