/** @type {import('next').NextConfig} */
const nextConfig = {
  productionBrowserSourceMaps: true,
  experimental: {
    authInterrupts: true,
  },
  output: 'standalone',
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["blob.v0.dev"],
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
        port: '',
        pathname: '/avatar/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost:3001',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'youtube.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'ruby-rails-boilerplate-3s9t.onrender.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    AUTH_URL: process.env.AUTH_URL, 
    NEXT_PUBLIC_AUTH_URL: process.env.NEXT_PUBLIC_AUTH_URL, 
    AUTH_SECRET: process.env.AUTH_SECRET,  
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,  
    GOOGLE_REDIRECT_URI: process.env.GOOGLE_REDIRECT_URI,  
    GOOGLE_APIS_YOUTUBE_FORCE_SSL_SCOPE: process.env.GOOGLE_APIS_YOUTUBE_FORCE_SSL_SCOPE,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,  
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    NEXT_PUBLIC_MAPBOX_TOKEN: process.env.NEXT_PUBLIC_MAPBOX_TOKEN,
    DRIZZLE_DATABASE_URL: process.env.DRIZZLE_DATABASE_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
  async rewrites() {
    return [
      {
        source: "/products/:slug/:variant_code.html",
        destination: "/products/:slug/:variant_code",
      },
      {
        source: "/products/edit/:slug/:variant_code.html",
        destination: "/products/edit/:slug/:variant_code",
      },
    ];
  },
};

export default nextConfig;
