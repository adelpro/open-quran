import type { TorrentFile } from 'webtorrent';

export type TorrentInfo = {
  magnetURI: string;
  files: TorrentFile[];
  downloaded: number;
  downloadSpeed: number;
  uploadSpeed: number;
  progress: number;
  peers: number;
  ready: boolean;
};
