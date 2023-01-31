module.exports = {
  trailingSlash: true,
  images: {
    loader: 'custom',
    domains: ['logo.uplead.com'],
    unoptimized: true,
  },
};

const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
});

module.exports = withPWA({
  trailingSlash: true,
  images: {
    loader: 'custom',
  },
});
