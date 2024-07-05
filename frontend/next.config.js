const withPWA = require('next-pwa')({
    dest: 'public',
    disable: process.env.NODE_ENV === 'development',
});

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
                hostname: 'minio',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                pathname: '/**',
            },
            {
                protocol: 'http',
                hostname: 'localhost',
                port: '9099',
                pathname: '/**',
            },
        ],
    },
};

module.exports = withPWA(nextConfig);
