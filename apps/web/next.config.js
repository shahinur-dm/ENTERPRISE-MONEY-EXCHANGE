/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@erp/types', '@erp/shared'],
  async rewrites() {
    const backendUrl = process.env.BACKEND_API_URL;
    if (backendUrl) {
      return [
        {
          source: '/api/v1/:path*',
          destination: `${backendUrl}/api/v1/:path*`,
        },
      ];
    }
    return [];
  },
};

module.exports = nextConfig;
