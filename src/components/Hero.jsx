'use client'
import { useEffect, useRef } from 'react';
import Link from 'next/link';

export default function Hero() {
    const videoRef = useRef(null);

    useEffect(() => {
        if (videoRef.current) {
            videoRef.current.play().catch(error => {
                console.error("Autoplay was prevented:", error);
            });
        }
    }, []);

    return (
        <div className="relative mt-14 mb-12 font-sans w-full h-[550px] overflow-hidden rounded-lg">
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
            >
                <source src="https://storage.naayiq.com/resources/forest.mp4" type="video/mp4" />
            </video>
            <div className="absolute -top-48 mr-1 font-medium text-center inset-0 transform right-0 left-1/2 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl mb-4 text-white ">
                    Welcome To<br />Nay Iraq
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