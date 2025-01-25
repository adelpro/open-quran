import Dialog from '@components/dialog';
import NarratorsList from '@components/narrator-list';
import React from 'react';

type Props = {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
};

export default function NarratorSelectorDialog({ isOpen, setIsOpen }: Props) {
  return (
    <Dialog isOpen={isOpen} setIsOpen={setIsOpen}>
      <NarratorsList setIsOpen={setIsOpen} />
    </Dialog>
  );
}
