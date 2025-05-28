/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    API_URL: process.env.API_URL,
    APP_PREFIX: process.env.APP_PREFIX,
  },
};

export default nextConfig;
