// /components/ProductItem.jsx

'use client';

import React, { memo } from 'react';
import Image from 'next/image';
import WishlistHeart from "@/components/WishlistHeart";
import {removeFileExtension} from "@/lib/api";

const CartIcon = memo(() => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect width="32" height="32" rx="16" fill="#3B5345"/>
        <path d="M12.5715 12.7009V11.9618C12.5715 10.2476 13.9506 8.56375 15.6649 8.40375C17.7068 8.20565 19.4287 9.81327 19.4287 11.8171V12.8685" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.7143 23.619H18.2858C21.3486 23.619 21.8972 22.3923 22.0572 20.899L22.6286 16.3276C22.8343 14.4685 22.301 12.9523 19.0477 12.9523H12.9524C9.69909 12.9523 9.16576 14.4685 9.37147 16.3276L9.9429 20.899C10.1029 22.3923 10.6515 23.619 13.7143 23.619Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="
round"/>
        <path d="M18.6631 15.9999H18.67" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M13.3292 15.9999H13.336" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
));

const ImageSkeleton = () => (
    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-t-lg" />
);

const ProductItem = memo(({ id, name, price, imageUrl, product, handleClick, onCartClick, isInWishlist }) => {
    const [imageLoaded, setImageLoaded] = React.useState(false);

    const handleProductClick = (e) => {
        if (!e.target.closest('.heart-icon')) {
            handleClick();
        }
    };

    const handleCartButtonClick = (e) => {
        e.stopPropagation();
        onCartClick(product);
    };

    const handleImageLoad = () => {
        setImageLoaded(true);
    };

    const isOutOfStock = React.useMemo(() => {
        if (product.has_color) {
            // If the product has colors, check each color's stock
            return product.colors.every(color => {
                if (color.has_size) {
                    return color.sizes.every(size => size.qty === 0);
                }
                return color.qty === 0;
            });
        } else if (product.has_size) {
            // If the product has sizes directly
            return product.sizes.every(size => size.qty === 0);
        } else {
            // Check product-level quantity
            return product.qty === 0;
        }
    }, [product]);

    return (
        <div className="rounded-lg" onClick={handleProductClick}>
            <div className="bg-white aspect-[186/275] relative flex flex-col w-full drop-shadow overflow-hidden group">
                <button className="absolute left-1 top-4 z-20 heart-icon" onClick={(e) => e.stopPropagation()}>
                    <WishlistHeart id={product.id} isInWishlist2={isInWishlist} />
                </button>

                {!imageLoaded && <ImageSkeleton />}
                <Image
                    src={`https://storage.naayiq.com/resources/${imageUrl}`}
                    alt={name}
                    onError={(e) => {
                        e.target.src = `https://storage.naayiq.com/resources/${imageUrl}`;
                    }}
                    width={500}
                    height={640}
                    quality={100}
                    onLoad={handleImageLoad}
                    className={`object-cover relative rounded-t-lg w-full h-full overflow-hidden transition-transform duration-300 group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                />

                <div className="absolute min-h-[84px] bottom-0 left-0 right-0 bg-gradient-custom rounded-t-lg p-2 flex flex-col justify-end">
                    <h3 className="font-serif line-clamp-2 capitalize overflow-ellipsis font-medium text-xs sm:text-sm leading-tight tracking-tight text-[#181717] mb-auto">
                        {name}
                    </h3>
                    <div className="flex justify-between items-center mt-2">
                        {isOutOfStock ? (
                            <p className="font-medium font-sans text-lg leading-tight tracking-tight text-[#C91C1C]">
                                Out of stock
                            </p>
                        ) : (
                            <p className="font-semibold font-serif text-lg leading-tight tracking-tight text-[#181717]">
                                {price}
                            </p>
                        )}
                        <button
                            className={`w-8 h-8 rounded-full flex items-center justify-center ${isOutOfStock ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#3B5345]'}`}
                            onClick={handleCartButtonClick}
                            disabled={isOutOfStock}
                        >
                            <CartIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

ProductItem.displayName = "ProductItem";
CartIcon.displayName = "CartIcon";

export default ProductItem;