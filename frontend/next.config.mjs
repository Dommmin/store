/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['via.placeholder.com', 'www.gravatar.com', 'minio', 'localhost'],
    remotePatterns: [
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
