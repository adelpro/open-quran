// next.config.mjs
import withBundleAnalyzer from '@next/bundle-analyzer';
import withSerwistInit from '@serwist/next';
import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const withSerwist = withSerwistInit({
  swSrc: 'src/sw.ts',
  swDest: 'public/sw.js',
  cacheOnNavigation: true,
  disable: !isProduction,
  register: isProduction,
  maximumFileSizeToCacheInBytes: 100 * 1024 * 1024, // 100MB
});

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
const configWithPWA = withSerwist(nextConfig);

/* How this will work

* Bundle-analyzer will run only if we pass 'ANALYZER=true' to our command (yarn analyze)
*
* next-PWA is disabled in developement ( disable: process.env.NODE_ENV === 'development', )
* next-PWA will run only with this command ( yarn build)
*
* running (yarn dev) will only pass the (config)
*/

export default withBundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})(configWithPWA);
