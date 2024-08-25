'use client'
import React, { useState } from 'react';
import { ChevronLeft } from 'lucide-react';
import Image from "next/image";
import {useRouter} from "next/navigation";

const coupons = [
    { type: 'Mother Day Coupons', code: 'M-Day25', validTill: 'Valid Till-22 Mar 2025', image: '/mom.png', bgColor: 'bg-pink-50', buttonColor: 'bg-[#FF81AE]/5 border-[#FF81AE]' },
    { type: 'Free Delivery Coupons', code: 'Free40', validTill: 'Valid Till-Today 12 am', image: '/car.png', bgColor: 'bg-blue-50', buttonColor: 'bg-[#90CAF9]/5 border-[#90CAF9]' },
    // { type: 'Valentine Coupons', code: 'VA-Day', validTill: 'Valid Till-Today 12 am', image: '/valentine.png', bgColor: 'bg-red-50', buttonColor: 'text-red-500 border-red-500' },
    // { type: 'Black Friday Coupons', code: 'B-Day', validTill: 'Valid Till-Today 12 am', image: '/black-friday.png', bgColor: 'bg-gray-100', buttonColor: 'text-gray-700 border-gray-700' },
    // { type: 'Birthday Coupons', code: 'B-Day', validTill: 'Valid Till-Today 12 am', image: '/birthday.png', bgColor: 'bg-yellow-50', buttonColor: 'text-yellow-600 border-yellow-600' },
    // { type: 'Christmas Coupons', code: 'CH-Day', validTill: 'Valid Till-Today 12 am', image: '/christmas.png', bgColor: 'bg-green-50', buttonColor: 'text-green-600 border-green-600' },
    // { type: 'Discount Coupons', code: 'DI34', validTill: 'Valid Till-Today 12 am', image: '/discount.png', bgColor: 'bg-purple-50', buttonColor: 'text-purple-600 border-purple-600' },
    // { type: 'Eid Coupons', code: 'EI34', validTill: 'Valid Till-Today 12 am', image: '/eid.png', bgColor: 'bg-indigo-50', buttonColor: 'text-indigo-600 border-indigo-600' },
];

const CouponCard = ({ type, code, validTill, image, bgColor, buttonColor }) => {
    const [copied, setCopied] = useState(false);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 700);
    };

    return (
        <div className={`flex font-serif font-medium items-center p-6 mb-4 bg-[#F6F3F1]/30 shadow-md rounded-lg`}>
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
            <div className="w-24 h-24 ml-4">
                <img src={image} alt={type} className="w-full h-full object-cover rounded-lg" />
            </div>
        </div>
    );
};

const MyCoupons = () => {
    const router = useRouter()
    return (
        <div className="bg-white min-h-screen p-6">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">My Coupons</h1>
            </header>
            <div className="space-y-4">
                {coupons.map((coupon, index) => (
                    <CouponCard key={index} {...coupon} />
                ))}
            </div>
        </div>
    );
};

export default MyCoupons;