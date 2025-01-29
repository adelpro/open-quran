import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';
import withPWA, { PWAConfig } from 'next-pwa';
import { CacheFirst, NetworkFirst } from 'workbox-strategies';

const isProduction = process.env.NODE_ENV === 'production';
// Runtime Caching rules
const runtimeCaching = [
  // HTTPS request caching
  {
    urlPattern: /^https?.*/,
    handler: new NetworkFirst(),
    options: {
      cacheName: 'https-calls',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        purgeOnQuotaError: true, // Automatically delete the cache if the quota is exceeded
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // Images caching
  {
    urlPattern: /\.(jpe?g|png|gif|webp)$/i,
    handler: new CacheFirst(),
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // JS, CSS caching
  {
    urlPattern: /\.(js|css)$/i,
    handler: new CacheFirst(),
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // Google Fonts caching
  {
    urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/,
    handler: new CacheFirst(),
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 90, // 90 days
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

const pwaConfig: PWAConfig = {
  dest: 'public',
  runtimeCaching,
};

/** @type {import('next').NextConfig} */
const config = {
  productionBrowserSourceMaps: !isProduction,
  removeConsole: isProduction && { exclude: ['error'] },
  typescript: {
    ignoreBuildErrors: false, // Set this to false if you want production builds to abort if there's type errors
  },
  eslint: {
    ignoreDuringBuilds: false, // Set this to false if you want production builds to abort if there's lint errors
  },
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

const nextConfig: NextConfig | PWAConfig = withPWA(pwaConfig)(config);

export default nextConfig &&
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(nextConfig);
