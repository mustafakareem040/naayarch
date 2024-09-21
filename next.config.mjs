/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        optimizeCss: true,
        optimisticClientCache: true,
        optimizeServerReact: true,
        optimizePackageImports: true
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
