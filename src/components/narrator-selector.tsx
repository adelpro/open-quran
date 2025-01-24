'use client';
import { useAtomValue } from 'jotai';
import Image from 'next/image';
import React from 'react';

import { selectedNarratorAtom } from '@/jotai/atom';
import search from '@/svgs/search.svg';

import NarratorSelectorDialog from './narrator-selector-dialog';

export default function NarratorSelector() {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  const selectedNarrator = useAtomValue(selectedNarratorAtom);
  const onButtonClick = () => {
    setIsOpen(true);
  };
  return (
    <div className="flex w-full justify-center">
      <button
        className="flex w-full max-w-md flex-row-reverse items-center justify-between rounded-md border border-slate-200 p-2 shadow-md transition-transform hover:scale-105"
        onClick={onButtonClick}
      >
        <span>{selectedNarrator ? selectedNarrator.name : 'اختر القارئ'}</span>
        <Image src={search} alt="search" width={30} height={30} />
      </button>
      <NarratorSelectorDialog isOpen={isOpen} setIsOpen={setIsOpen} />
    </div>
  );
}
