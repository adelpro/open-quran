export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun.cloudflare.com',
        'stun:global.stun.twilio.com:3478',

        // Optional extra for redundancy:
        // 'stun:stun1.l.google.com:19305',
      ],
    },
  ],
};
