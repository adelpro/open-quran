import React, { useEffect, useRef, useState } from 'react';
import WebTorrent from 'webtorrent';

type Props = {
  magnetURI: string;
};
export default function Torrrent({ magnetURI }: Props) {
  const [torrentInfo, setTorrentInfo] = useState<{
    name: string;
    files: any;
  }>();
  const audioRef = useRef(null);
  const torrentClientRef = useRef(new WebTorrent());

  useEffect(() => {
    const torrentClien = torrentClientRef.current;

    torrentClien.add(magnetURI, (torrent: any) => {
      console.log('Torrent added:', torrent);

      // Update state with torrent info
      setTorrentInfo({
        name: torrent.name,
        files: torrent.files.map((file: any) => file.name),
      });

      // Find the audio file in the torrent
      const audioFile = torrent.files.find((file: any) =>
        file.name.endsWith('.mp3')
      );

      if (audioFile) {
        // Stream the audio file to the audio element
        audioFile.renderTo(audioRef.current, { autoplay: true });
      }
    });

    // Cleanup function to destroy the torrent when the component unmounts
    return () => {
      torrentClien.destroy();
    };
  }, [magnetURI]);
  return <div>Torrent</div>;
}
