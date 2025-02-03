export const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'relay1.expressturn.com:34788',
      username: process.env.NEXT_PUBLIC_EXPRESSTURN_USERNAME as string,
      credential: process.env.NEXT_PUBLIC_EXPRESSTURN_CREDENTIAL as string,
    },
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: process.env.NEXT_PUBLIC_METERED_USERNAME as string,
      credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL as string,
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: process.env.NEXT_PUBLIC_METERED_USERNAME as string,
      credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL as string,
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: process.env.NEXT_PUBLIC_METERED_USERNAME as string,
      credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL as string,
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: process.env.NEXT_PUBLIC_METERED_USERNAME as string,
      credential: process.env.NEXT_PUBLIC_METERED_CREDENTIAL as string,
    },
  ],
};
