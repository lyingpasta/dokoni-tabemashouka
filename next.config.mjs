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
  }
};

export default nextConfig;
