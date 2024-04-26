/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com'],
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'minio',
        port: '9099',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
