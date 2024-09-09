'use client'
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function Hero() {
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    return (
        <div className="relative mt-14 mb-12 font-sans w-full h-[550px] overflow-hidden rounded-lg">
            {isClient && (
                <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                >
                    <source src="https://storage.naayiq.com/resources/water.mp4" type="video/mp4" />
                </video>
            )}
            <div
                className="absolute mr-1 font-medium text-center inset-0 transform right-0 top-1/4 left-1/2 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl font-serif font-medium mb-4 text-white ">
                    Welcome To<br/>Naay Iraq
                </h1>
                <Link
                    href="/products"
                    prefetch={false}
                    className="px-6 font-serif text-sm sssm:text-[1em] ssm:text-xl py-[0.535rem] border-white border-[1px] border-solid bg-white bg-opacity-50 black rounded-[20px] backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}