import Link from 'next/link';

import ActivitySVG from '@/svgs/activity-svg';

export default function ActivityStatus() {
  return (
    <Link
      href="https://tracker.openquran.us.kg/stats"
      target="_blank"
      className="absolute left-1 top-1 flex flex-row-reverse items-center justify-center gap-1 p-1 px-3 transition-all duration-300 hover:scale-105 hover:text-blue-500 dark:border-gray-600 dark:bg-gray-800 dark:hover:text-blue-800"
    >
      <div className="relative h-8 w-8 md:h-5 md:w-5">
        <ActivitySVG />
      </div>
      <p className="hidden text-xs md:inline-block">حالة الخادم</p>
    </Link>
  );
}
