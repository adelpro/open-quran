import { config } from '@/utils';

export const rtcConfig: RTCConfiguration = {
  iceServers: [
    { urls: 'stun:stun.l.google.com:19302' },
    {
      urls: 'relay1.expressturn.com:34788',
      username: config.EXPRESSTURN_USERNAME as string,
      credential: config.EXPRESSTURN_CREDENTIAL as string,
    },
    {
      urls: 'stun:stun.relay.metered.ca:80',
    },
    {
      urls: 'turn:global.relay.metered.ca:80',
      username: config.METERED_USERNAME as string,
      credential: config.METERED_CREDENTIAL as string,
    },
    {
      urls: 'turn:global.relay.metered.ca:80?transport=tcp',
      username: config.METERED_USERNAME as string,
      credential: config.METERED_CREDENTIAL as string,
    },
    {
      urls: 'turn:global.relay.metered.ca:443',
      username: config.METERED_USERNAME as string,
      credential: config.METERED_CREDENTIAL as string,
    },
    {
      urls: 'turns:global.relay.metered.ca:443?transport=tcp',
      username: config.METERED_USERNAME as string,
      credential: config.METERED_CREDENTIAL as string,
    },
  ],
};
