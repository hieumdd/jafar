import type { NextConfig } from 'next';

const isProduction = process.env.NODE_ENV === 'production';

const repo = 'jafar';

const nextConfig: NextConfig = {
    /* config options here */
    assetPrefix: isProduction ? `/${repo}/` : '',
    basePath: isProduction ? `/${repo}` : '',
    reactStrictMode: true,
    output: 'export',
    images: { unoptimized: true },
};

export default nextConfig;
