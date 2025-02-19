// next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';
import withSerwist from '@serwist/next';
import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

// Configure serwist options – adjust swSrc/swDest as needed.
const serwistConfig = {
  swSrc: 'public/sw.js', // location of your custom service worker
  swDest: 'public/sw.js',
  cacheOnFrontEndNav: true,
  skipWaiting: true,
  dynamicStartUrl: false, // Precache home page instead of storing it in runtime cache
};

const nextConfig: NextConfig = {
  reactStrictMode: !isProduction,
  poweredByHeader: !isProduction,
  transpilePackages: ['jotai-devtools'],
  compiler: {
    removeConsole: isProduction && { exclude: ['error'] },
  },
  typescript: {
    ignoreBuildErrors: !isProduction,
  },
  eslint: {
    ignoreDuringBuilds: !isProduction,
  },
  experimental: {
    // nextScriptWorkers: true,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: [{ removeAttrs: { attrs: ['fill'] } }],
            },
          },
        },
      ],
    });
    return config;
  },
};

// Wrap your Next.js config with serwist.
const configWithPWA = withSerwist(serwistConfig)(nextConfig);

// Finally, chain with bundle analyzer.
export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(configWithPWA);
