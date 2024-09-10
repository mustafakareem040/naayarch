'use client'
import React, { memo } from 'react';
import Image from 'next/image';

const ProductItem = memo(({ id, name, price, imageUrl, handleClick }) => {
    return (
        <div className="block" onClick={handleClick}>
            <div className="bg-white aspect-[186/275] relative flex flex-col w-full drop-shadow overflow-hidden group">
                <button className="absolute left-1 top-4 z-10" onClick={(e) => e.preventDefault()}>
                    <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect width="30" height="30" rx="15" fill="url(#paint0_linear_733_2359)"/>
                        <path
                            d="M10.5 7C8.0151 7 6 8.98817 6 11.4411C6 13.4212 6.7875 18.1206 14.5392 22.8712C14.6781 22.9555 14.8375 23 15 23C15.1625 23 15.3219 22.9555 15.4608 22.8712C23.2125 18.1206 24 13.4212 24 11.4411C24 8.98817 21.9849 7 19.5 7C17.0151 7 15 9.69156 15 9.69156C15 9.69156 12.9849 7 10.5 7Z"
                            stroke="#C91C1C" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <defs>
                            <linearGradient id="paint0_linear_733_2359" x1="15" y1="0" x2="15" y2="30"
                                            gradientUnits="userSpaceOnUse">
                                <stop stopColor="white" stopOpacity="0.8"/>
                                <stop offset="1" stopColor="#F5F5F5" stopOpacity="0.8"/>
                            </linearGradient>
                        </defs>
                    </svg>
                </button>
                <Image
                    src={imageUrl}
                    alt={name}
                    fill={true}
                    sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 10vw"
                    unoptimized={true}
                    onError={(e) => {
                        e.target.src = "/noimage.png";
                    }}
                    className="object-cover relative rounded-t-lg w-full h-full overflow-hidden transition-transform duration-300 group-hover:scale-110"
                />
                <div
                    className="absolute min-h-[84px] bottom-0 left-0 right-0 bg-gradient-custom rounded-t-lg p-2 flex flex-col justify-end">
                    <h3 className="font-serif line-clamp-2 capitalize overflow-ellipsis font-medium text-xs sm:text-sm leading-tight tracking-tight text-[#181717] mb-auto">
                        {name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                        <p className="font-semibold font-serif text-lg leading-tight tracking-tight text-[#181717]">
                            {price}
                        </p>
                        <button className="w-8 h-8 bg-[#3B5345] rounded-full flex items-center justify-center"
                                onClick={(e) => e.preventDefault()}>
                            <svg width="32" height="32" viewBox="0 0 32 32" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <rect width="32" height="32" rx="16" fill="#3B5345"/>
                                <path
                                    d="M12.5715 12.7009V11.9618C12.5715 10.2476 13.9506 8.56375 15.6649 8.40375C17.7068 8.20565 19.4287 9.81327 19.4287 11.8171V12.8685"
                                    stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                                <path
                                    d="M13.7143 23.619H18.2858C21.3486 23.619 21.8972 22.3923 22.0572 20.899L22.6286 16.3276C22.8343 14.4685 22.301 12.9523 19.0477 12.9523H12.9524C9.69909 12.9523 9.16576 14.4685 9.37147 16.3276L9.9429 20.899C10.1029 22.3923 10.6515 23.619 13.7143 23.619Z"
                                    stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                    strokeLinejoin="round"/>
                                <path d="M18.6631 15.9999H18.67" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                                <path d="M13.3292 15.9999H13.336" stroke="white" strokeWidth="2" strokeLinecap="round"
                                      strokeLinejoin="round"/>
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )});
ProductItem.displayName = "ProductItem"
export default ProductItem;