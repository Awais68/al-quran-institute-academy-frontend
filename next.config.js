// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   output: "export",
// };
// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["res.cloudinary.com"],
  },
};

export default nextConfig;
