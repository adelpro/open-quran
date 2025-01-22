const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

// Runtime Caching rules
const runtimeCaching = [
  // https request caching
  {
    urlPattern: /^https?.*/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'https-calls',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 7, // 7 days
        purgeOnQuotaError: true, // Automatically delete the cache if the quota is exceeded.
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // Images caching
  {
    urlPattern: /\.(jpe?g|png|gif|webp)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-image-assets',
      expiration: {
        maxEntries: 50,
        maxAgeSeconds: 60 * 60 * 24 * 30,
        // 30 days.
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // js,css caching
  {
    urlPattern: /\.(js|css)$/i,
    handler: 'CacheFirst',
    options: {
      cacheName: 'static-assets',
      expiration: {
        maxEntries: 200,
        maxAgeSeconds: 60 * 60 * 24 * 90,
        // 90 days
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
  // Google fonts caching
  {
    urlPattern: /^https?:\/\/fonts\.googleapis\.com\/.*/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'google-fonts',
      expiration: {
        maxAgeSeconds: 60 * 60 * 24 * 90,
        // 90 days
        purgeOnQuotaError: true,
      },
      cacheableResponse: {
        statuses: [0, 200],
      },
    },
  },
];

const withPWA = require('next-pwa')({
  dest: 'public',
  runtimeCaching,
});

/** @type {import('next').NextConfig} */
const config = {
  productionBrowserSourceMaps: false,
  compiler: {
    removeConsole:
      process.env.NODE_ENV === 'production' ? { exclude: ['error'] } : false,
  },
  typescript: {
    // Set this to false if you want production builds to abort if there's type errors
    ignoreBuildErrors: false,
  },
  eslint: {
    // Set this to false if you want production builds to abort if there's lint errors
    ignoreDuringBuilds: false,
  },
  experimental: {
    turbo: {
      rules: {},
    },
  },
};

module.exports = withBundleAnalyzer(withPWA(config));
