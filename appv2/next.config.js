/** @type {import('next').NextConfig} */
/*const nextConfig = {
  images: {
    domains: [
      'raw.githubusercontent.com',
    ],
  },
}

module.exports = nextConfig*/
const nextConfig = {
  reactStrictMode: true,
  output: "export",
  images: {
    domains: [
      'raw.githubusercontent.com',
    ],
  },
  webpack: (config, { isServer }) => {
    if (!isServer) {
      config.resolve.fallback.fs = false
    }
    config.externals.push('pino-pretty', 'encoding')
    return config
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig