import { NextResponse } from 'next/server';

import { RECITERS } from '@/constants';
import { updateTrackerInMagnetURI } from '@/utils';
export async function GET() {
  // extract all magnet uri from TRACKERS
  const magnetURIArray = Object.values(RECITERS).map(({ magnet }) => {
    return updateTrackerInMagnetURI(magnet);
  });
  return NextResponse.json({ magneturis: magnetURIArray });
}
