'use client';
import { useSetAtom } from 'jotai';
import React from 'react';

import { RECITERS } from '@/constants';
import { selectedReciterAtom } from '@/jotai/atom';
import { Reciter } from '@/types';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};
export default function RecitersList({ setIsOpen }: Props) {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const setSelectedReciter = useSetAtom(selectedReciterAtom);
  const selectedReciterClickHandler = (reciter: Reciter) => {
    setSelectedReciter(reciter);
    setIsOpen(false);
  };
  return (
    <section className="w-full">
      <div className="mx-auto flex flex-col gap-1 p-2">
        <input
          type="search"
          placeholder="ابحث عن القارئ"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          className="mb-4 w-full rounded-lg border border-gray-200 bg-background p-2 text-right shadow-md dark:border-gray-400"
        />
        {RECITERS.filter((reciter) => reciter.name.includes(searchTerm)).map(
          (reciter) => (
            <button
              key={reciter.id}
              className="w-full flex-1 cursor-pointer rounded-lg border border-gray-200 p-2 shadow-md transition-transform hover:scale-105 dark:border-gray-400"
              onClick={() => selectedReciterClickHandler(reciter)}
            >
              <h2 className="font-semibol mb-2 text-right text-xl">
                {reciter.name}
              </h2>
              <p className="mb-1 text-right">{`برواية ${reciter.riwaya}`}</p>
            </button>
          )
        )}
      </div>
    </section>
  );
}
