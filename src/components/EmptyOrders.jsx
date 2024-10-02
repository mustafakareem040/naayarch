// components/EmptyOrders.jsx
'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";

const EmptyOrders = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col min-h-screen bg-white p-4 font-sans items-center justify-center">

            <main className="flex-grow flex flex-col items-center">
                <div className="relative w-full h-[33vh]">
                    <Image
                        src="https://storage.naayiq.com/resources/empty_cart.gif"
                        alt="Empty orders"
                        fill
                        unoptimized={true}
                        priority={true}
                        quality={100}
                        className="object-contain"
                    />
                </div>
                <p className="text-3xl font-semibold font-serif text-black mb-12">No orders were found!</p>
                <div className="w-full font-serif text-sm ssm:text-base ssm2:text-lg font-medium flex justify-center items-center gap-4">
                    <Link
                        href="/wishlist"
                        className="px-3 ssm:px-6 flex items-center justify-center min-h-[56px] bg-[rgba(59,83,69,0.05)] text-[#3B5345] rounded-lg outline outline-1 outline-[#3B5345]">
                        Check Wishlist
                    </Link>
                    <Link href="/" className="min-h-[56px] flex items-center justify-center px-3 ssm:px-6 bg-[#3B5345] text-white rounded-lg">
                        Start Browsing
                    </Link>
                </div>
            </main>
        </div>
    );
};

export default EmptyOrders;