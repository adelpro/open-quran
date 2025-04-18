export const rtcConfig = {
  iceServers: [
    // Primary STUN servers (limiting to 4 as recommended)
    { urls: 'stun:stun1.l.google.com:19302' },
    { urls: 'stun:stun2.l.google.com:19302' },

    // Single TURN server for NAT traversal
    {
      urls: 'turn:openrelay.metered.ca:443',
      username: 'openrelayproject',
      credential: 'openrelayproject',
    },
  ],
  // Removing sdpSemantics as it's no longer needed in modern browsers
};
