export const ensureTrackerInMagnetURI = (
  magnetURI: string,
  tracker: string
) => {
  const trackerParameter = `tr=${encodeURIComponent(tracker)}`;
  if (!magnetURI.includes(trackerParameter)) {
    return `${magnetURI}&${trackerParameter}`;
  }
  return magnetURI;
};
