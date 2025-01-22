'use client';
import Link from 'next/link';
import React from 'react';

import { Narrator } from '@/types';

type Props = {
  selectedNarators: Narrator[];
};
export default function NaratorsList({ selectedNarators }: Props) {
  return (
    <section className="mt-8 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-6 p-4 sm:p-6 lg:justify-start lg:p-8">
        {selectedNarators.map((narator) => (
          <Link
            key={narator.id}
            href={`/narsators/${narator.id}`}
            className="min-w-[100%] max-w-[30%] flex-1 transform cursor-pointer rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform hover:scale-105 sm:min-w-[48%] lg:min-w-[30%]"
          >
            <h2 className="mb-2 text-xl font-semibold text-gray-800">
              {narator.name}
            </h2>
            <p className="mb-1 text-gray-600">{narator.riwaya}</p>
            <p className="text-gray-600">{narator.complet}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
