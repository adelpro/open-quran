import { serverConfig } from '@/utils';

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      // STUN (Session Traversal Utilities for NAT)
      urls: [
        'stun:stun.l.google.com:19302',
        'stun:stun.cloudflare.com',
        'stun:global.stun.twilio.com:3478',

        // Optional extra for redundancy:
        // 'stun:stun1.l.google.com:19305',
      ],
    },
    serverConfig.EXPRESSTURN_USERNAME &&
      serverConfig.EXPRESSTURN_CREDENTIAL && {
        urls: 'turns:relay1.expressturn.com:3478',
        username: serverConfig.EXPRESSTURN_USERNAME,
        credential: serverConfig.EXPRESSTURN_CREDENTIAL,
      },
    serverConfig.METERED_USERNAME &&
      serverConfig.METERED_CREDENTIAL && {
        urls: [
          'turns:global.relay.metered.ca:443?transport=tcp',
          'turn:global.relay.metered.ca:443',
          'turn:global.relay.metered.ca:80?transport=tcp',
        ],
        username: serverConfig.METERED_USERNAME,
        credential: serverConfig.METERED_CREDENTIAL,
      },
  ].filter(Boolean),
};
