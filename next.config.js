/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
 
  images : {
    domains : [
      "thrangra.sirv.com"
    ]
  }
}

module.exports = nextConfig
