import React from 'react';
import Image from 'next/image';

const ProductItem = ({ title, price, imageUrl }) => {
    return (
        <div className="bg-white aspect-[186/275] relative flex flex-col w-full drop-shadow overflow-hidden group">
            <button className="absolute left-1 top-4 z-10">
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g filter="url(#filter0_b_733_2359)">
                        <rect width="30" height="30" rx="15" fill="url(#paint0_linear_733_2359)"/>
                        <path
                            d="M10.5 7C8.0151 7 6 8.98817 6 11.4411C6 13.4212 6.7875 18.1206 14.5392 22.8712C14.6781 22.9555 14.8375 23 15 23C15.1625 23 15.3219 22.9555 15.4608 22.8712C23.2125 18.1206 24 13.4212 24 11.4411C24 8.98817 21.9849 7 19.5 7C17.0151 7 15 9.69156 15 9.69156C15 9.69156 12.9849 7 10.5 7Z"
                            stroke="#C91C1C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <filter id="filter0_b_733_2359" x="-41" y="-41" width="112" height="112"
                                filterUnits="userSpaceOnUse" colorInterpolationFilters="sRGB">
                            <feFlood floodOpacity="0" result="BackgroundImageFix"/>
                            <feGaussianBlur in="BackgroundImageFix" stdDeviation="20.5"/>
                            <feComposite in2="SourceAlpha" operator="in" result="effect1_backgroundBlur_733_2359"/>
                            <feBlend mode="normal" in="SourceGraphic" in2="effect1_backgroundBlur_733_2359"
                                     result="shape"/>
                        </filter>
                        <linearGradient id="paint0_linear_733_2359" x1="15" y1="0" x2="15" y2="30"
                                        gradientUnits="userSpaceOnUse">
                            <stop stopColor="white" stopOpacity="0.8"/>
                            <stop offset="1" stopColor="#F5F5F5" stopOpacity="0.8"/>
                        </linearGradient>
                    </defs>
                </svg>
            </button>
            <button className="relative w-full h-full overflow-hidden">
                <Image
                src={imageUrl}
                alt={title}
                fill={true}
                onError={(event) => {
                    event.target.id = "/noimage.png";
                    event.target.srcset = "/noimage.png";
                }}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            </button>
            <div className="absolute min-h-[84px] bottom-0 left-0 right-0 bg-gradient-custom rounded-t-lg p-2 flex flex-col justify-end">
                <h3 className="font-serif line-clamp-2 overflow-ellipsis font-medium text-xs sm:text-sm leading-tight tracking-tight text-[#181717] mb-auto">
                    {title}
                </h3>
                <div className="flex justify-between items-center mt-2">
                    <p className="font-semibold font-serif text-lg leading-tight tracking-tight text-[#181717]">
                        {price}
                    </p>
                    <button className="w-8 h-8 bg-[#3B5345] rounded-full flex items-center justify-center">
                        <Image src="/shop.svg" alt="shop" width={40} height={40} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductItem;