import React from 'react';
import Image from 'next/image';

const ProductItem = ({ title, price, imageUrl }) => {
    return (
        <div className="bg-white aspect-[3/4] relative flex flex-col w-full drop-shadow overflow-hidden group">
            <button className="absolute left-1 top-4 z-10">
                <Image src="/white-heart.svg" alt="heart" width={30} height={30} />
            </button>
            <button className="relative w-full h-full overflow-hidden">
                <Image
                src={imageUrl}
                alt={title}
                fill={true}
                unoptimized={true}
                className="object-cover transition-transform duration-300 group-hover:scale-110"
            />
            </button>
            <div className="absolute min-h-[70px] bottom-0 left-0 right-0 bg-gradient-custom rounded-t-lg p-2 flex flex-col justify-end">
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