const withPWA = require('next-pwa')({
   dest: 'public',
   disable: process.env.NODE_ENV === 'development',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   images: {
      domains: ['via.placeholder.com', 'www.gravatar.com', 'nginx'],
      remotePatterns: [
         {
            protocol: 'https',
            hostname: 'via.placeholder.com',
            pathname: '/**',
         },
         {
            protocol: 'https',
            hostname: 'www.gravatar.com',
            pathname: '/**',
         },
         {
            protocol: 'http',
            hostname: 'nginx',
            port: '80',
            pathname: '/storage/**',
         },
      ],
   },
};

module.exports = withPWA(nextConfig);
