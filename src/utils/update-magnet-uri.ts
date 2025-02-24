import { TRACKERS } from '@/constants';

export const updateMagnetURI = (magnetURI: string) => {
  if (!TRACKERS?.length) {
    return magnetURI;
  }

  // Split the magnet URI into base and query parameters
  const [base, query = ''] = magnetURI.split('?');
  const params = query.split('&').filter(Boolean);

  // Remove any trackers that use udp, http, or https protocols
  const filteredParams = params.filter((parameter) => {
    if (parameter.startsWith('tr=')) {
      const tracker = decodeURIComponent(parameter.slice(3));
      return !(
        tracker.startsWith('udp:') ||
        tracker.startsWith('http:') ||
        tracker.startsWith('https:')
      );
    }
    return true;
  });

  // Reassemble the magnet URI from the base and the filtered parameters
  let newMagnetURI =
    base + (filteredParams.length > 0 ? `?${filteredParams.join('&')}` : '');

  // Append ws trackers if they are not already included
  for (const tracker of TRACKERS) {
    const trackerParameter = `tr=${encodeURIComponent(tracker)}`;
    if (!newMagnetURI.includes(trackerParameter)) {
      newMagnetURI +=
        (newMagnetURI.includes('?') ? '&' : '?') + trackerParameter;
    }
  }
  return newMagnetURI;
};
