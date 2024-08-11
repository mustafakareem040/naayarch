'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";

const MyCoupons = () => {
    const [copied, setCopied] = useState(false);
    const router = useRouter()
    const handleCopy = () => {
        navigator.clipboard.writeText('Free-2024');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="p-2">
            <div className="flex mt-2 items-center mb-10">
                <button onClick={router.back}>
                    <Image src={"/arrow-left.svg"} width={40} height={40} alt={"left"}/>
                </button>
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 -z-10 text-center font-medium font-sans">My
                    Coupons</h1>
            </div>

            <div className="font-serif bg-[#F6F3F1] rounded-lg mt-8 relative">
                <div
                    className="absolute -left-6 top-1/2 w-14 h-14 bg-white rounded-[100%] transform -translate-y-1/2"></div>
                <div
                    className="absolute -right-6 top-1/2 w-14 h-14 bg-white rounded-[100%] transform -translate-y-1/2"></div>
                <div className="py-6 text-center">
                    <h2 className="text-lg font-semibold mb-4">Free Delivery Code</h2>
                    <div className="border-t border-dashed border-black mt-5 mb-12"></div>
                    <p className="text-[#695C5C] text-[0.875rem] font-medium mb-2">Coupon Code</p>
                    <p className="text-3xl font-sans font-bold mb-4">Free-2024</p>
                    <button
                        onClick={handleCopy}
                        className="bg-[#3B5345]/10 text-[#3B5345] mt-4 py-4 px-20 font-bold rounded-lg mb-4 relative overflow-hidden"
                    >
            <span className={`absolute inset-0 flex items-center justify-center transition-opacity duration-150 ${copied ? 'opacity-100' : 'opacity-0'}`}>
              Copied!
            </span>
                        <span className={`transition-opacity duration-300 ${copied ? 'opacity-0' : 'opacity-100'}`}>
              Copy Code
            </span>
                    </button>
                    <p className="mb-6 text-[#695C5C] font-medium font-serif text-center">Valid Till-30 Jan 2025</p>
                </div>
            </div>
        </div>
    );
};

export default MyCoupons;