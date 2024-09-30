// src/components/WishlistItem.jsx

'use client';

import React from "react";
import Image from "next/image"; // Ensure Image is imported
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ShoppingBag from "@/components/ShoppingBag";

const getCheapestPrice = (product) => {
    const prices = [
        product.price && product.price !== '0.00' ? parseFloat(product.price) : Infinity,
        ...(product.sizes?.map((size) => parseFloat(size.price)) || []),
        ...(product.colors?.flatMap((color) => [
            parseFloat(color.price),
            ...(color.sizes?.map((size) => parseFloat(size.price)) || []),
        ]) || []),
    ].filter((price) => !isNaN(price) && isFinite(price));

    return prices.length > 0 ? Math.min(...prices) : null;
};

const WishlistItem = ({ product, onRemove }) => {
    const router = useRouter();

    const handleShoppingBagClick = () => {
        router.push(`/products/${product.id}`);
    };

    if (!product) {
        // Optionally, render nothing or a fallback UI
        return null;
    }

    // Ensure product.images is an array and check its length
    const image = (Array.isArray(product.images) && product.images.length > 0)
        ? `https://storage.naayiq.com/resources/${product.images[0]?.url}`
        : "https://storage.naayiq.com/resources/noimage.webp";

    return (
        <div className="bg-white rounded-lg p-4 flex items-stretch space-x-4 mb-4">
            <div className="relative w-[30%] min-h-[120px]">
                <Image
                    src={image}
                    alt={product.name}
                    fill={true}
                    unoptimized={true}
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <h3 className="font-serif font-medium text-base text-center">{product.name}</h3>
                <h3 className="font-serif font-medium text-base text-center">
                    {getCheapestPrice(product) !== null ? `${getCheapestPrice(product).toLocaleString()} IQD` : "N/A"}
                </h3>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
                <button onClick={() => onRemove(product.id)} className="p-1">
                    <X size={24} />
                </button>
                <button onClick={handleShoppingBagClick} className="bg-[#3B5345] rounded-full p-2">
                    <ShoppingBag width={24} height={24} />
                </button>
            </div>
        </div>
    );
};

export default WishlistItem;