/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: ['@erp/types', '@erp/shared'],
};

module.exports = nextConfig;
