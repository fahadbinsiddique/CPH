/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  output: 'standalone',

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
      // 🎯 Cloudinary-কে 'domains' থেকে সরিয়ে 'remotePatterns'-এ নিয়ে আসা হলো
      {
        hostname: 'res.cloudinary.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

}

export default nextConfig;