'use client';
import React, { useState, memo } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const CustomProduct = memo(function CustomProduct({
                                                      title,
                                                      subtitle,
                                                      description,
                                                      bigimg = '/face.webp',
                                                      flower,
                                                      hideFlower,
                                                  }) {
    const [isBigImgLoaded, setIsBigImgLoaded] = useState(false);
    const [isFlowerImgLoaded, setIsFlowerImgLoaded] = useState(false);

    return (
        <div className="white  rounded-lg p-4 mb-12">
            <p className="text-center font-medium font-sans text-3xl">
                {title}
            </p>
            {!hideFlower && flower && (
                <div className="absolute left-[45%] sm:left-1/2 rounded-3xl transform -translate-x-1/2 z-10">
                    {!isFlowerImgLoaded && (
                        <div className="w-24 h-24 bg-gray-200 animate-pulse rounded-3xl" />
                    )}
                    <Image
                        unoptimized={true}
                        src={`https://storage.naayiq.com/resources${flower}`}
                        className={`rounded-3xl ${isFlowerImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        alt="Flower"
                        width={96}
                        height={96}
                        onLoad={() => setIsFlowerImgLoaded(true)}
                    />
                </div>
            )}

            <div
                className={`flex gap-2 w-full justify-center place-content-baseline ${hideFlower ? 'mt-2 mb-16 ssm:mb-2' : 'mt-16'}`}
            >
                <div
                    className={`flex mt-7 ssm:mt-10 ssm4:mt-16 flex-col w-[35%] justify-stretch items-baseline transform ${hideFlower ? '' : 'relative bottom-8'}`}
                >
                    <p className="inline font-sans mb-7 text-xl md:text-2xl lg:text-3xl">
                        {subtitle}
                    </p>
                    <p className="text-sm font-serif fig mb-7">{description}</p>
                    <Link
                        href="/products"
                        prefetch={false}
                        className="text-sm font-serif pb-2 text-[#3B5345] font-bold border-b w-fit border-[#695C5C] inline-block"
                    >
                        Show More
                    </Link>
                </div>

                <div className="relative w-[60%] max-h-[400px] -translate-y-2 aspect-[3/4]">
                    {!isBigImgLoaded && (
                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                    )}
                    <Image
                        src={`https://storage.naayiq.com/resources${bigimg}`}
                        alt="Product Image"
                        fill={true}
                        unoptimized={true}
                        className={`rounded-lg object-cover ${isBigImgLoaded ? 'opacity-100' : 'opacity-0'}`}
                        onLoad={() => setIsBigImgLoaded(true)}
                    />
                </div>
            </div>
        </div>
    );
});

export default CustomProduct;