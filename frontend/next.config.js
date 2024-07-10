const withPWA = require('next-pwa')({
   dest: 'public',
   disable: process.env.NODE_ENV === 'development',
});
const TerserPlugin = require('terser-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
   reactStrictMode: true,
   swcMinify: true,
   images: {
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
   webpack(config, { dev, isServer }) {
      if (!dev && !isServer) {
         config.optimization.minimizer.push(
            new TerserPlugin({
               terserOptions: {
                  compress: {
                     drop_console: true,
                  },
               },
            }),
         );
      }

      return config;
   },
};

module.exports = withPWA(nextConfig);
