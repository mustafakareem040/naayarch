import Image from 'next/image';

export default function Loading() {
    return (
        <div className="flex items-center bg-[#f6f6f6] -m-4 justify-center min-h-screen">
            <Image
                src="/loading.gif"
                alt="Loading..."
                fill={true}
                className="object-contain"
                quality={100}
                priority
            />
        </div>
    );
}