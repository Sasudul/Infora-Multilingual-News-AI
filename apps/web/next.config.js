/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.adaderana.lk' },
      { protocol: 'https', hostname: '**.dailymirror.lk' },
      { protocol: 'https', hostname: '**.newsfirst.lk' },
      { protocol: 'https', hostname: '**.hirunews.lk' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
    ],
  },
};

module.exports = nextConfig;
