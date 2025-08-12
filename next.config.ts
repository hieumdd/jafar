import type { NextConfig } from 'next';

const repo = 'jafar';

const nextConfig: NextConfig = {
    /* config options here */
    assetPrefix: `/${repo}/`,
    basePath: `/${repo}`,
    reactStrictMode: true,
    output: 'export',
    images: { unoptimized: true },
};

export default nextConfig;
