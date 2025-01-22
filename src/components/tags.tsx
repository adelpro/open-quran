import { Riwaya } from '@/types'
import { cn } from '@/utils/cn'
import React from 'react'

export default function tags() {
    const [riwaya, setRiwaya] = React.useState<Riwaya>(Riwaya.Hafs)
  return (
    <section className="mt-8 w-full max-w-md flex flex-row gap-3 justify-center">
        {Object.values(Riwaya).map(
          (value) => (
            console.log(value),
            (
              <option key={value} value={value}>
                <span
                  className={cn(
                    "border px-10 py-2 border-slate-700 rounded-md cursor-pointer",
                    value === riwaya && "bg-neutral-200"
                  )}
                >
                  {value}
                </span>
              </option>
            )
          )
        )}
      </section>
  )
}
