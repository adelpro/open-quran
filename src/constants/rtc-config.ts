import { serverConfig } from '@/utils';
const meteredTurnServers =
  serverConfig.METERED_USERNAME && serverConfig.METERED_CREDENTIAL
    ? [
        {
          urls: [
            'turns:global.relay.metered.ca:443?transport=tcp',
            'turn:global.relay.metered.ca:443',
            'turn:global.relay.metered.ca:80?transport=tcp',
          ],
          username: serverConfig.METERED_USERNAME,
          credential: serverConfig.METERED_CREDENTIAL,
        },
      ]
    : [];

const expressTurnServers =
  serverConfig.EXPRESSTURN_USERNAME && serverConfig.EXPRESSTURN_CREDENTIAL
    ? [
        {
          urls: 'turns:relay1.expressturn.com:3478',
          username: serverConfig.EXPRESSTURN_USERNAME,
          credential: serverConfig.EXPRESSTURN_CREDENTIAL,
        },
      ]
    : [];

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    // Primary STUN
    { urls: 'stun:stun1.l.google.com:19305' },
    { urls: 'stun:stun.l.google.com:19305' },
    { urls: 'stun:stun.cloudflare.com' },

    // TURN servers (prioritize TCP/TLS)
    //...meteredTurnServers,
    //...expressTurnServers,
  ],
};
