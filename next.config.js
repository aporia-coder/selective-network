/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'uploadthing.com',
        pathname: '**',
        port: '',
      },
      {
        protocol: 'https',
        hostname: 'utfs.io',
        pathname: '**',
        port: '',
      },
    ],
  },
}

module.exports = nextConfig
