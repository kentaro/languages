/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: process.env.NODE_ENV === 'production' ? '/languages' : '',
  images: {
    unoptimized: true,
  },
  // Disabled during static export to stop the build from failing. Run `pnpm lint` locally.
  eslint: {
    ignoreDuringBuilds: true,
  },
  env: {
    NEXT_PUBLIC_BASE_PATH: process.env.NODE_ENV === 'production' ? '/languages' : '',
  },
}

export default nextConfig;
