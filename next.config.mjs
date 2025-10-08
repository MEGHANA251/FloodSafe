/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.imdpune.gov.in' },
      { protocol: 'https', hostname: '**.nasa.gov' }
    ]
  },
  experimental: {
    typedRoutes: true
  }
};

export default nextConfig;

