/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        optimisticClientCache: true,
        optimizeServerReact: true,
        optimizeCss: true
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
