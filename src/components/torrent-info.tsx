import Image from 'next/image';
import React from 'react';

import useTorrent from '@/hooks/use-torrent';
import checkedSVG from '@/svgs/checked.svg';
import downloadSVG from '@/svgs/download.svg';
import fileSVG from '@/svgs/file.svg';
import peerSVG from '@/svgs/peer.svg';
import progressSVG from '@/svgs/progress.svg';
import savedSVG from '@/svgs/saved.svg';
import uploadSVG from '@/svgs/upload.svg';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};
export default function TorrentInfo({ setIsOpen }: Props) {
  const { torrentInfo } = useTorrent();

  if (!torrentInfo) {
    return <></>;
  }
  return (
    <div
      className="text-md m-2 flex flex-row justify-center p-2 text-center text-gray-600"
      onClick={() => setIsOpen(false)}
    >
      <div className="m-2 flex flex-row gap-1">
        <Image src={downloadSVG} alt="icon" width={20} height={20} />
        <p>{`${(torrentInfo?.downloadSpeed / 1024).toFixed(2)}KB/s`}</p>
      </div>
      <div className="m-2 flex flex-row gap-1">
        <Image src={uploadSVG} alt="icon" width={20} height={20} />
        <p>{`${(torrentInfo?.uploadSpeed / 1024).toFixed(2)}KB/s`}</p>
      </div>
      <div className="m-2 flex flex-row gap-1">
        <Image src={savedSVG} alt="icon" width={20} height={20} />
        <p>{`${(torrentInfo?.downloaded / 1e6).toFixed(2)}MB`}</p>
      </div>
      <div className="m-2 flex flex-row gap-1">
        <Image src={progressSVG} alt="icon" width={20} height={20} />
        <p>{`${(torrentInfo?.progress * 100).toFixed(1)}%`}</p>
      </div>
      <div className="m-2 flex flex-row gap-1">
        <Image src={peerSVG} alt="icon" width={20} height={20} />
        <p>{`${torrentInfo?.peers}`}</p>
      </div>
      {torrentInfo?.ready && (
        <div className="m-2 flex flex-row gap-1">
          <Image src={checkedSVG} alt="icon" width={20} height={20} />
          <p>Ready</p>
        </div>
      )}
      {
        <div className="m-2 flex flex-row gap-1">
          <Image src={fileSVG} alt="icon" width={20} height={20} />
          <p>{`${torrentInfo?.files.length}`}</p>
        </div>
      }
    </div>
  );
}
