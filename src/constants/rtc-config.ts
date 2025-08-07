export const rtcConfig = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:global.stun.twilio.com:3478' },
    {
      urls: 'turn:turn.quran.us.kg:3478?transport=udp',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
    },
    {
      urls: 'turn:turn.quran.us.kg:3478?transport=tcp',
      username: process.env.NEXT_PUBLIC_TURN_USERNAME,
      credential: process.env.NEXT_PUBLIC_TURN_PASSWORD,
    },
  ],
};
