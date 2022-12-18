const { PHASE_DEVELOPMENT_SERVER } = require('next/dist/shared/lib/constants');

module.exports = (phase) => {
  /** @type {import('next').NextConfig} */
  const nextConfig = {
    reactStrictMode: true,
    rewrites: phase === PHASE_DEVELOPMENT_SERVER ? async () => [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8787/api/:path*' // Proxy to Backend
      }
    ]
    : undefined,
  };
  return nextConfig;
}
