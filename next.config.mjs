/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["thalleslorrhan.pythonanywhere.com"],
  },
  experimental: {
    turbo: false, // desativa Turbopack, que dá erro com Mapbox
  },
};

export default nextConfig;
