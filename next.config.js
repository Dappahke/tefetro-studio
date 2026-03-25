/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use Webpack instead of Turbopack (more stable)
  webpack: (config) => {
    return config;
  },
  
  // Images config
  images: {
    domains: ['localhost', '*.supabase.co', 'images.unsplash.com'],
  },
  
  // Headers for API routes
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
