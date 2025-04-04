import Link from 'next/link';

import { clientConfig } from '@/utils';

export default function ActivityStatus() {
  return (
    <Link
      href={clientConfig.TRACKER_URL}
      target="_blank"
      className="absolute left-1 top-1 flex flex-row-reverse items-center justify-center gap-1 p-1 px-3 transition-all duration-300 hover:scale-105 hover:text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:hover:text-blue-800"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 32 32"
        aria-hidden="true"
        focusable="false"
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
      <p className="hidden text-xs md:inline-block">حالة الخادم</p>
    </Link>
  );
}
