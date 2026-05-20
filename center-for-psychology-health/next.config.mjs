/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'centreforpsychologicalhealth.com',
        port: '',
        pathname: '/**',
      },
    ],
    domains: ['res.cloudinary.com'],
  },
}

export default nextConfig
