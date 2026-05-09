# WebTorrent Integration in Open Quran

This document summarizes how WebTorrent is used to load and play audio streams within the Open Quran project.

## 1. Script Injection (`src/components/torrrent.tsx`)
The `TorrentPlayer` component handles injecting the WebTorrent library. It uses `next/script` to load `webtorrent.min.js` from a CDN (`jsdelivr`). Once the script loads successfully, it updates a global Jotai state (`webtorrentReadyAtom`) to `true`.

## 2. Client Initialization (`src/hooks/use-torrent.ts`)
The `useTorrent` custom hook is responsible for managing the WebTorrent instance and the torrent lifecycle.
- It listens to the `webtorrentReadyAtom`. Once it becomes `true`, it creates a singleton instance of `window.WebTorrent` (stored in `clientRef`), injecting custom WebRTC configurations (`rtcConfig`).

## 3. Torrent Loading & Processing (`src/hooks/use-torrent.ts`)
The hook reacts to changes in the selected reciter's `magnetURI`:
- It first destroys any previously active torrents to free up resources.
- It then adds the new torrent using `localClient.add(updatedMagnetURI, { announce: TRACKERS })`.
- Once the torrent's metadata is ready, it scans through the files and filters out anything that isn't an audio file by checking if the name ends with `.mp3`.

## 4. Stream to Blob URL Conversion (`src/hooks/use-torrent.ts`)
This is the core of how the stream becomes playable:
- For each MP3 file in the torrent, it extracts the Surah ID from the filename.
- It calls WebTorrent's `file.getBlobURL()` function. This asynchronously buffers/streams the file from the torrent swarm and generates a local browser object URL (e.g., `blob:http://localhost:3000/...`) that points to the incoming stream.
- It maps all these blob URLs into a structured `playlist` array containing `{ surahId, link: blobURL }` and saves it to the `torrentInfo` state.

## 5. Media Playback (`src/components/torrrent.tsx`)
- The `TorrentPlayer` component reads the `torrentInfo` object returned by the `useTorrent` hook.
- If the `torrentInfo.files` array has elements (the playlist of blob URLs), it renders the `<MusicPlayer playlist={torrentInfo.files} />` component.
- The `MusicPlayer` can then use these `blob:` URLs directly in an `<audio>` tag (or standard audio logic) exactly as if they were regular MP3 files hosted on a standard server, while WebTorrent handles the peer-to-peer downloading seamlessly in the background.

## 6. Architecture Note: Dual WebTorrent Imports
You may notice that WebTorrent is imported in two different ways within the project: via a CDN script and as an NPM package. This dual-presence serves a specific architectural purpose:

- **The `<Script>` Tag (Browser/Runtime):** WebTorrent relies heavily on built-in Node.js modules (`Buffer`, `stream`, `events`, etc.). Importing the NPM package directly for execution would cause Next.js bundling issues and significantly inflate the application's bundle size. To bypass this, the pre-bundled, browser-ready version is loaded directly from a CDN (`webtorrent.min.js`) via `<Script>` and executed globally as `window.WebTorrent`.
- **The NPM Package (TypeScript/Compile-time):** The NPM package (`webtorrent`) and its types (`@types/webtorrent`) are installed solely for development safety. By using type-only imports (e.g., `import type { Instance, Torrent } from 'webtorrent';`), the editor provides autocomplete and type-checking, but Next.js completely strips out the heavy package during the build process.
