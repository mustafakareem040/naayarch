'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";

const CouponCard = ({ type, code, validTill, image, bgColor, buttonColor }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 700);
    };

    return (
        <div className={`flex font-serif font-medium items-center p-6 mb-4 ${bgColor} shadow-md rounded-lg`}>
            <div className="flex-1">
                <p className="text-sm text-[#695C5C]">{type}</p>
                <h3 className="text-black font-sans text-2xl">{code}</h3>
                <p className="text-xs text-[#695C5C]">{validTill}</p>
                <button
                    onClick={handleCopy}
                    className={`mt-2 font-semibold px-7 py-1 text-sm ${buttonColor} border border-dashed rounded-lg transition-all duration-300 ease-in-out`}
                >
                    {copied ? 'Copied!' : 'Copy Code'}
                </button>
            </div>
            <div className="w-24 h-24 ml-4 relative">
                <Image
                    src={image}
                    alt={type}
                    fill
                    className="object-cover rounded-lg"
                />
            </div>
        </div>
    );
};



const MyCoupons = ({ coupons }) => {
    const router = useRouter();
    return (
        <div className="bg-white min-h-screen p-6">
            <header className="flex items-center mb-6">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 cursor-pointer relative z-20"
                />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    My Coupons
                </h1>
            </header>
            <div className="space-y-4">
                {coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                        <CouponCard key={index} {...coupon} />
                    ))
                ) : (
                    <p className="text-center text-gray-500">No coupons available.</p>
                )}
            </div>
        </div>
    );
};



export default MyCoupons;