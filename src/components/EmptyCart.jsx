'use client'
import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from "next/link";

const EmptyCart = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-white p-4 font-sans">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="https://storage.naayiq.com/resources/arrow-left.svg" unoptimized={true} width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Cart
                </h1>
            </header>

            <main className="flex-grow flex flex-col items-center">
                <div className="relative w-full h-[65vh]">
                    <Image
                        src="https://storage.naayiq.com/resources/empty.png"
                        alt="Empty cart"
                        fill
                        unoptimized={true}
                        priority={true}
                        quality={100}
                        className="object-contain"
                    />
                </div>
                <p className="text-3xl font-semibold font-serif text-black mb-12">Empty Cart</p>
                    <div className="w-full font-serif text-sm ssm:text-base ssm2:text-lg font-medium flex justify-center items-center gap-4">
                        <Link
                            href={"/wishlist"}
                            className="px-3 ssm:px-6 flex items-center justify-center min-h-[56px] bg-[rgba(59,83,69,0.05)] text-[#3B5345] rounded-lg outline outline-1 outline-[#3B5345]">
                            Check Wishlist
                        </Link>
                        <Link href={"/"} className="min-h-[56px] flex items-center justify-center px-3 ssm:px-6 bg-[#3B5345] text-white rounded-lg">
                            Start Browsing
                        </Link>
                    </div>
            </main>
        </div>
);
};

export default EmptyCart;