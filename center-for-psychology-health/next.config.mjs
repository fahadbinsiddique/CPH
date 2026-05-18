/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**', // ক্লাউডিনারির ভেতরের যেকোনো পাথের ছবি এলাউ করবে
      },
    ],
  },
};

export default nextConfig;