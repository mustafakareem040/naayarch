'use client';

import { useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const HeroImage = ({ onLoadingComplete }) => (
    <Image
        src="https://storage.naayiq.com/resources/water.png"
        alt="Ice texture"
        fill
        sizes="(max-width: 768px) 100vw, 768px"
        priority
        className="object-cover"
        onLoadingComplete={onLoadingComplete}
    />
);

const HeroContent = () => (
    <div className="absolute -top-36 mr-1 ssm:-top-24 font-medium text-center inset-0 transform right-0 left-1/2 flex flex-col items-center justify-center space-y-4">
        <h1 className="text-2xl mb-4 font-serif text-white">
            Welcome To<br />Naay Iraq
        </h1>
        <Link
            href="/products"
            className="px-6 font-serif text-sm sssm:text-[1em] ssm:text-xl py-[0.535rem] border-white border-[1px] border-solid bg-white bg-opacity-50 black rounded-[20px] backdrop-blur-sm hover:bg-opacity-30 transition-colors"
        >
            Shop Now
        </Link>
    </div>
);

const LoadingSkeleton = () => (
    <div className="absolute inset-0 animate-pulse bg-gray-300 rounded-lg" />
);

export default function Hero() {
    const [isLoading, setIsLoading] = useState(true);

    const handleLoadingComplete = useCallback(() => {
        setIsLoading(false);
    }, []);

    return (
        <div className="relative mb-12 font-sans w-full h-[550px] overflow-hidden rounded-lg">
            <HeroImage onLoadingComplete={handleLoadingComplete} />
            {isLoading && <LoadingSkeleton />}
            <HeroContent />
        </div>
    );
}