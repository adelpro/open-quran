import React from 'react';

import { playlist, surah } from '@/constants';
type Props = {
  setIsOpen: (isOpen: boolean) => void;
};

export default function Playlist({ setIsOpen }: Props) {
  return (
    <main>
      <h1 className="my-2 w-full text-center">القائمة</h1>
      <ul>
        {playlist.map((element, index) => (
          <li
            key={index}
            className="mx-2 my-3 w-full cursor-pointer rounded p-2 text-slate-500 transition-colors duration-300 hover:bg-gray-200 hover:text-slate-800"
            onClick={() => setIsOpen(false)}
          >
            {surah[element.surahId]}
          </li>
        ))}
      </ul>
    </main>
  );
}
