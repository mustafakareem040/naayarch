'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const EmptyCart = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-white p-4 font-sans">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Cart
                </h1>
            </header>

            <main className="flex-grow flex flex-col items-center">
                <div className="relative w-full h-[65vh]">
                    <Image
                        src="/empty.png"
                        alt="Empty cart"
                        fill
                        priority={true}
                        quality={100}
                        className="object-contain"
                    />
                </div>
                <p className="text-3xl font-semibold font-serif text-black mb-12">Empty Cart</p>
                    <div className="w-full font-serif font-lg font-medium flex justify-center items-center gap-4">
                        <button
                            className="px-6 min-h-[56px] bg-[rgba(59,83,69,0.05)] text-[#3B5345] rounded-lg outline outline-1 outline-[#3B5345]">
                            Check Wishlist
                        </button>
                        <button className="min-h-[56px] px-6 bg-[#3B5345] text-white rounded-lg">
                            Start Browsing
                        </button>
                    </div>
            </main>
        </div>
);
};

export default EmptyCart;