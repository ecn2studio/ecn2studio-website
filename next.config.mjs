/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: "/credit-preview/index.html",
        destination: "/credit-preview",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;




