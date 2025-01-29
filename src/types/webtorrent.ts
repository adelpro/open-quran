import WebTorrent from 'webtorrent';

declare global {
  interface Window {
    WebTorrent: WebTorrent.Instance;
  }
}

export {};
