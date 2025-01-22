import React from 'react';

import { narators } from '@/constants';

export default function NaratorsList() {
  const [search, setSearch] = React.useState('');
  return (
    <section className="mt-8 w-full px-4 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-screen-xl flex-wrap justify-center gap-6 p-4 sm:p-6 lg:justify-start lg:p-8">
        {narators
          .filter((narator) => narator.name.includes(search))
          .map((narator) => (
            <div
              key={narator.id}
              className="min-w-[100%] max-w-[30%] flex-1 transform rounded-lg border border-gray-200 bg-white p-6 shadow-md transition-transform hover:scale-105 sm:min-w-[48%] lg:min-w-[30%]"
            >
              <h2 className="mb-2 text-xl font-semibold text-gray-800">
                {narator.name}
              </h2>
              <p className="mb-1 text-gray-600">{narator.riwaya}</p>
              <p className="text-gray-600">{narator.complet}</p>
            </div>
          ))}
      </div>
    </section>
  );
}
