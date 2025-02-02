export const rtcConfig: any = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: process.env.NEXT_PUBLIC_EXPRESSTURN_SERVER_URL,
      username: process.env.NEXT_PUBLIC_EXPRESSTURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_EXPRESSTURN_CREDENTIAL,
    },
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: '58b13c4d98bc67dcf4e4134c',
      credential: 'Bwgmzn/ErgE12hgP',
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: '58b13c4d98bc67dcf4e4134c',
      credential: 'Bwgmzn/ErgE12hgP',
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: '58b13c4d98bc67dcf4e4134c',
      credential: 'Bwgmzn/ErgE12hgP',
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: '58b13c4d98bc67dcf4e4134c',
      credential: 'Bwgmzn/ErgE12hgP',
    },
  ],
};
