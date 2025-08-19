/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    appDir: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
  async rewrites() {
    return [
      {
        source: '/api/socket.io/:path*',
        destination: 'http://localhost:8001/socket.io/:path*',
      },
    ]
  },
}

module.exports = nextConfig