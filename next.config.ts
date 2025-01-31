import withBundleAnalyzer from '@next/bundle-analyzer';
import { NextConfig } from 'next';
import withPWA, { PWAConfig } from 'next-pwa';

const isProduction = process.env.NODE_ENV === 'production';

const pwaConfig: PWAConfig = {
  dest: 'public',
  cacheOnFrontEndNav: true,
  skipWaiting: true,
  dynamicStartUrl: false, // precache home page instead of storing it in runtime cache by default

  /* fallbacks: {
    image: '/static/images/fallback.png',
    document: '',
    font: '',
    audio: '',
    video: '',
  }, */
};

/** @type {import('next').NextConfig} */
const config = {
  productionBrowserSourceMaps: !isProduction,
  transpilePackages: ['jotai-devtools'],
  compiler: {
    removeConsole: isProduction && { exclude: ['error'] },
  },
  typescript: {
    ignoreBuildErrors: false, // Set this to false if you want production builds to abort if there's type errors
  },
  eslint: {
    ignoreDuringBuilds: false, // Set this to false if you want production builds to abort if there's lint errors
  },
  experimental: {
    //nextScriptWorkers: true,
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
