import { TRACKERS } from '@/constants';

export const updateMagnetURI = (magnetURI: string) => {
  if (!TRACKERS?.length) return magnetURI;

  const [base, query = ''] = magnetURI.split('?');
  const params = new URLSearchParams(query);

  const xt = params.get('xt');
  if (!xt || !xt.startsWith('urn:btih:')) return magnetURI; // invalid or malformed

  // Remove all trackers
  params.delete('tr');

  // Extract and keep only wss:// or ws:// trackers from original magnet
  const trackerRegex = /tr=([^&]+)/g;
  const existingTrackers = new Set<string>();
  let match;
  while ((match = trackerRegex.exec(query)) !== null) {
    const trValue = decodeURIComponent(match[1]);
    if (trValue.startsWith('wss://') || trValue.startsWith('ws://')) {
      existingTrackers.add(trValue.toLowerCase());
    }
  }

  // Add back the filtered trackers
  for (const tracker of existingTrackers) params.append('tr', tracker);

  // Append missing trackers from TRACKERS
  for (const tracker of TRACKERS) {
    if (!existingTrackers.has(tracker.toLowerCase())) {
      params.append('tr', tracker);
    }
  }

  // Remove 'xt' from params so we can add it manually without encoding
  params.delete('xt');

  const parameterString = params.toString();

  return `${base}?xt=${xt}${parameterString ? '&' + parameterString : ''}`;
};
