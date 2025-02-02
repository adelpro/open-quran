'use client';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import React from 'react';

import useTorrent from '@/hooks/use-torrent';
import { selectedReciterAtom } from '@/jotai/atom';
import connectionSVG from '@/svgs/connection.svg';
import connectionAnimatedSVG from '@/svgs/connection-animated.svg';
import searchSVG from '@/svgs/search.svg';

import ReciterSelectorDialog from './reciter-selector-dialog';

export default function ReciterrSelector() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  //TODO MAke torrent ready globale state
  const { torrentInfo } = useTorrent(false);
  const selectedReciterValue = useAtomValue(selectedReciterAtom);
  const onButtonClick = () => {
    setIsOpen(true);
  };
  const connectionIcon = (): React.ReactNode => {
    if (selectedReciterValue === undefined) {
      return <></>;
    }
    return torrentInfo ? (
      <Image src={connectionSVG} alt="connected" width={30} height={30} />
    ) : (
      <Image
        src={connectionAnimatedSVG}
        alt="connecting"
        width={30}
        height={30}
        onClick={() => console.log('Show connection dialog')}
      />
    );
  };
  return (
    <div className="flex w-full justify-center">
      <button
        className="flex w-full max-w-md flex-row-reverse items-center justify-between rounded-md border border-slate-200 p-2 shadow-md transition-transform hover:scale-105"
        onClick={onButtonClick}
      >
        <span>
          {selectedReciterValue ? selectedReciterValue.name : 'اختر القارئ'}
        </span>
        <div className="flex flex-row items-center justify-center">
          {connectionIcon()}
          <Image src={searchSVG} alt="search" width={30} height={30} />
        </div>
      </button>
      <ReciterSelectorDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
