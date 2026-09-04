/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  serverExternalPackages: ['tiktok-live-connector', 'ws', 'bufferutil', 'utf-8-validate'],
  transpilePackages: [
    '@aep/types',
    '@aep/game-engines',
    '@aep/content-library',
    '@aep/tiktok-live',
    '@aep/audio-visual-fx'
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'commondatastorage.googleapis.com' }
    ]
  },
  webpack: (config) => {
    return config;
  }
};

module.exports = nextConfig;
