/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  output: 'standalone',
  async redirects() {
    return [
      // Redirect old city URLs: /mn/afton/ -> /states/mn/afton/
      {
        source: '/mn/:city',
        destination: '/states/mn/:city',
        permanent: true,
      },
      {
        source: '/mn/:city/',
        destination: '/states/mn/:city',
        permanent: true,
      },
      {
        source: '/ak/:city',
        destination: '/states/ak/:city',
        permanent: true,
      },
      {
        source: '/ak/:city/',
        destination: '/states/ak/:city',
        permanent: true,
      },
      {
        source: '/ia/:city',
        destination: '/states/ia/:city',
        permanent: true,
      },
      {
        source: '/ia/:city/',
        destination: '/states/ia/:city',
        permanent: true,
      },
      {
        source: '/wi/:city',
        destination: '/states/wi/:city',
        permanent: true,
      },
      {
        source: '/wi/:city/',
        destination: '/states/wi/:city',
        permanent: true,
      },
      // Redirect old venue URLs if they existed: /mn/afton/venue-name -> /states/mn/afton/venue-name
      {
        source: '/mn/:city/:venue',
        destination: '/states/mn/:city/:venue',
        permanent: true,
      },
      {
        source: '/ak/:city/:venue',
        destination: '/states/ak/:city/:venue',
        permanent: true,
      },
      {
        source: '/ia/:city/:venue',
        destination: '/states/ia/:city/:venue',
        permanent: true,
      },
      {
        source: '/wi/:city/:venue',
        destination: '/states/wi/:city/:venue',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
