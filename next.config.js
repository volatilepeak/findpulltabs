/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  // Ensure all location pages are statically generated
  output: 'standalone',
};

module.exports = nextConfig;
