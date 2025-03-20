const nextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'fastly.4sqi.net',
        pathname: '/img/**',
        port: ''
      }
    ]
  },
  experimental: {
    serverComponentsExternalPackages: ["pino", "pino-pretty"],
  },
};

export default nextConfig;
