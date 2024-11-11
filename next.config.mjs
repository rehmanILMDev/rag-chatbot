// /** @type {import('next').NextConfig} */
// const nextConfig = {};

// export default nextConfig;
// /** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      serverComponentsExternalPackages: ['pdf-parse'],
    },
  }
  
export default nextConfig;
