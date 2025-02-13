/*
wss://tracker.openwebtorrent.com:443/announce

wss://tracker.magnetoo.io:443/announce

wss://tracker.files.fm:7073/announce

wss://tracker.btorrent.xyz:443/announce

wss://spacetradersapi-chatbox.herokuapp.com:443/announce
*/

export const updateTrackerInMagnetURI = (
  magnetURI: string,
  trackesr: string[]
) => {
  if (!trackesr?.length) {
    return magnetURI;
  }
  for (const tracker of trackesr) {
    const trackerParameter = `tr=${encodeURIComponent(tracker)}`;
    if (!magnetURI.includes(trackerParameter)) {
      return `${magnetURI}&${trackerParameter}`;
    }
    return magnetURI;
  }
};
