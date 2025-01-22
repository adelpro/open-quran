import { narators } from '@/constants'
import React from 'react'

export default function NaratorsList() {
    const [search, setSearch] = React.useState('')
  return (
         <section className="mt-8 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-screen-xl mx-auto flex flex-wrap justify-center lg:justify-start gap-6 p-4 sm:p-6 lg:p-8">
          {narators
            .filter((narator) => narator.name.includes(search))
            .map((narator) => (
              <div
                key={narator.id}
                className="flex-1 min-w-[100%] sm:min-w-[48%] lg:min-w-[30%] max-w-[30%] p-6 border border-gray-200 rounded-lg shadow-md bg-white transition-transform transform hover:scale-105"
              >
                <h2 className="text-xl font-semibold text-gray-800 mb-2">
                  {narator.name}
                </h2>
                <p className="text-gray-600 mb-1">{narator.riwaya}</p>
                <p className="text-gray-600">{narator.complet}</p>
              </div>
            ))}
        </div>
      </section>
  )
}
