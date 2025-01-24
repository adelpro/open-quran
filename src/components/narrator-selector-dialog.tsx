import Image from 'next/image';
import React, { ReactNode, useLayoutEffect, useRef } from 'react';

import useEscapeKey from '@/hooks/use-escape-key-hook';
import close from '@/svgs/close.svg';

import NarratorsList from './narrator-list';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};
export default function NarratorSelectorDialog({
  isOpen,
  setIsOpen,
}: Props): ReactNode {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEscapeKey(() => setIsOpen(false));
  useLayoutEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    } else if (!isOpen && dialogRef.current?.open) {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClick={(event) => {
        if (event.target === dialogRef.current) {
          setIsOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === 'Escape') {
          setIsOpen(false);
        }
      }}
      className="top-50 left-50 -translate-x-50 -translate-y-50 fixed z-10 w-full max-w-md origin-top animate-slideInWithFade rounded-xl p-2 backdrop:bg-zinc-800/50"
    >
      {/**
       * How the backdrop close modal is working?
       *  - Add onClick to dialog :
       * onClick={(e) => {
       *   if (e.target === dialogRef.current) {
       *     setIsOpen(false);
       *   }
       * }}
       * - Add p-0 to the dialog
       * - Add a container div inside the dialig
       * */}
      <main className="min-w-80 rounded-xl p-2">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
          >
            <Image src={close} alt="close" width={24} height={24} />
          </button>
        </div>
        <NarratorsList setIsOpen={setIsOpen} />
      </main>
    </dialog>
  );
}
