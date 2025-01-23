import { atom } from 'jotai';

import { Narrator } from '@/types';

export const selectedNarratorAtom = atom<Narrator | undefined>();
