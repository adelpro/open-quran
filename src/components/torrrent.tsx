import React, { useEffect, useRef, useState } from 'react';
import WebTorrent, { type Torrent, type TorrentFile } from 'webtorrent';

type Props = {
  magnetURI: string;
};
interface TorrentInfo {
  files: string[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
}

export default function Torrrent({ magnetURI }: Props) {
  const [torrentInfo, setTorrentInfo] = useState<TorrentInfo>();
  const audioRef = useRef<HTMLAudioElement>(null);
  const torrentClientRef = useRef(new WebTorrent());

  useEffect(() => {
    const torrentClient = torrentClientRef.current;

    torrentClient.add(magnetURI, (torrent: Torrent) => {
      console.log('Client is downloading:', torrent.infoHash);

      /*  // Update state with torrent info
      setTorrentInfo({
        files: torrent.files.map((file: TorrentFile) => file.name),
        downloaded: torrent.downloaded,
        downloadSpeed: torrent.downloadSpeed,
        uploadSpeed: torrent.uploadSpeed,
        progress: torrent.progress,
      });

      // Find the audio file in the torrent
      const audioFile = torrent.files.find((file: TorrentFile) =>
        file.name.endsWith('.mp3')
      );

      if (audioFile && audioRef.current) {
        // Stream the audio file to the audio element
        audioFile.renderTo(audioRef.current, { autoplay: true });
      } */
    });

    // Cleanup function to destroy the torrent when the component unmounts
    return () => {
      torrentClient.destroy();
    };
  }, [magnetURI]);
  return (
    <div className="my-2.5 rounded bg-gray-100 p-2.5">
      {torrentInfo &&
        `Downloaded: ${(torrentInfo.downloaded / 1024 / 1024).toFixed(2)}MB | Speed: ${(torrentInfo.downloadSpeed / 1024).toFixed(2)}KB/s | Upload: ${(torrentInfo.uploadSpeed / 1024).toFixed(2)}KB/s | Progress: ${(torrentInfo.progress * 100).toFixed(1)}%`}
    </div>
  );
}
