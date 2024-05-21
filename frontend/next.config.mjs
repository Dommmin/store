/** @type {import('next').NextConfig} */
const nextConfig = {
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

export default nextConfig;
