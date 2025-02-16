import Image from 'next/image';
import Link from 'next/link';

import activitySVG from '@/svgs/activity.svg'; // Adjust the path if needed

export default function ActivityStatus() {
  return (
    <Link
      href="https://tracker.openquran.us.kg/stats"
      target="_blank"
      className="absolute left-1 top-1 flex flex-row-reverse items-center justify-center gap-1 p-1 px-3 transition-all duration-300 hover:scale-105 hover:text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:hover:text-blue-800"
    >
      <div className="relative h-8 w-8 md:h-5 md:w-5">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 32 32"
          aria-hidden="true"
          focusable="false"
          className="h-full w-full"
        >
          <path
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M3 16h6l4-11l6 22l4-11h6"
          />
        </svg>
      </div>
      <p className="hidden text-xs md:inline-block">حالة الخادم</p>
    </Link>
  );
}
