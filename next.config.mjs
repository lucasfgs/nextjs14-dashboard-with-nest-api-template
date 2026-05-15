/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    typedRoutes: true,
  },
  env: {
    API_URL: process.env.API_URL,
    APP_PREFIX: process.env.APP_PREFIX,
    WEBSOCKET_URL: process.env.WEBSOCKET_URL,
  },
};

export default nextConfig;
