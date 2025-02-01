import Image from 'next/image';
import React, { ReactNode, useLayoutEffect, useRef } from 'react';

import close from '@/svgs/close.svg';
type DialogProps = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: ReactNode;
};

export default function Dialog({ isOpen, setIsOpen, children }: DialogProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

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
      className="top-50 left-50 -translate-x-50 -translate-y-50 fixed z-10 w-full max-w-xl origin-top animate-slideInWithFade overflow-auto rounded-xl backdrop:bg-zinc-800/50 dark:backdrop:bg-zinc-200/50"
    >
      <main className="w-full min-w-80 rounded-xl bg-background p-2 px-8 text-foreground">
        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setIsOpen(false)}
            aria-label="Close"
            className="transition-transform duration-200 hover:scale-110"
          >
            <Image src={close} alt="close" width={24} height={24} />
          </button>
        </div>
        {children}
      </main>
    </dialog>
  );
}
