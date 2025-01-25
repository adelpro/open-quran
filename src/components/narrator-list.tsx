'use client';
import { useSetAtom } from 'jotai';
import React from 'react';

import { narrators } from '@/constants';
import { selectedNarratorAtom } from '@/jotai/atom';
import { Narrator } from '@/types';

type Props = {
  setIsOpen: (isOpen: boolean) => void;
};
export default function NarratorsList({ setIsOpen }: Props) {
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const setSelectedNarrator = useSetAtom(selectedNarratorAtom);
  const selectedNarratorClickHandler = (narrator: Narrator) => {
    setSelectedNarrator(narrator);
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
        {narrators
          .filter((narrator) => narrator.name.includes(searchTerm))
          .map((narrator) => (
            <button
              key={narrator.id}
              className="w-full flex-1 cursor-pointer rounded-lg border border-gray-200 p-2 shadow-md transition-transform hover:scale-105 dark:border-gray-400"
              onClick={() => selectedNarratorClickHandler(narrator)}
            >
              <h2 className="font-semibol mb-2 text-right text-xl">
                {narrator.name}
              </h2>
              <p className="mb-1 text-right">{`برواية ${narrator.riwaya}`}</p>
            </button>
          ))}
      </div>
    </section>
  );
}
