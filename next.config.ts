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
  // reactStrictMode: !isProduction,
  poweredByHeader: !isProduction,
  transpilePackages: ['jotai-devtools'],
  compiler: {
    removeConsole: isProduction && { exclude: ['error'] },
  },
  typescript: {
    ignoreBuildErrors: !isProduction, // Set this to false if you want production builds to abort if there's type errors
  },
  eslint: {
    ignoreDuringBuilds: !isProduction, // Set this to false if you want production builds to abort if there's lint errors
  },
  experimental: {
    //nextScriptWorkers: true,
    turbo: {
      rules: {},
    },
  },
  /*   webpack(config: any) {
    config.module.rules.push({
      test: /\.svg$/,
      issuer: /\.[jt]sx?$/,
      use: ['@svgr/webpack'],
    });
    return config;
  }, */
};

const nextConfig: NextConfig | PWAConfig = withPWA(pwaConfig)(config);

export default nextConfig &&
  withBundleAnalyzer({
    enabled: process.env.ANALYZE === 'true',
  })(nextConfig);
