/** @type {import('next').NextConfig} */
const nextConfig = {
    experimental: {
        reactCompiler: true,
        ppr: 'incremental'
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
