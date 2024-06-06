/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    PUBLIC_IMAGE_API_BASE_URL: process.env.PUBLIC_IMAGE_API_BASE_URL
  },
  images: {
    unoptimized: true
  }
}

module.exports = nextConfig
