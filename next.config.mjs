/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        optimizeCss: true,
        optimisticClientCache: true,
        webpackMemoryOptimizations: true,
        parallelServerCompiles: true,
        webpackBuildWorker: true
    },
    webpack: (config, { dev, isServer }) => {
        if (!dev && !isServer) {
            Object.assign(config.resolve.alias, {
                react: 'preact/compat',
                'react-dom/test-utils': 'preact/test-utils',
                'react-dom': 'preact/compat',
            });
        }

        return config;
    },
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'storage.naayiq.com',
            },
        ],
    },
}

export default nextConfig;
