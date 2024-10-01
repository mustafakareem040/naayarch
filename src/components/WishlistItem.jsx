// src/components/WishlistItem.jsx

'use client';

import React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import ShoppingBag from "@/components/ShoppingBag";
import { motion } from "framer-motion"; // Import motion

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

// Memoize the component to prevent unnecessary re-renders
const WishlistItem = React.memo(({ product, onRemove }) => {
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
        <motion.div
            layout
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.3 } }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="bg-[#F6F3F1]/30 py-4 px-3 shadow-[0px_2px_4px_3px_rgba(0,0,0,0.1)] min-h-[201px] rounded-lg flex items-stretch space-x-4 mb-4"
        >
            <div className="relative min-h-[100px] sssm:min-h-[115px] ssm:min-h-[154px] aspect-[154/169]">
                <Image
                    src={image}
                    alt={product.name}
                    fill={true}
                    unoptimized={true}
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex-grow flex flex-col gap-2 items-center justify-center">
                <h3 className="font-serif font-medium text-sm ssm2:text-base text-center">{product.name}</h3>
                <h3 className="font-serif font-medium text-sm ssm2:text-base text-center">
                    {getCheapestPrice(product) !== null ? `${getCheapestPrice(product).toLocaleString()} IQD` : "N/A"}
                </h3>
            </div>
            <div className="flex flex-col min-h-[201px] justify-between items-center space-y-2">
                <button onClick={() => onRemove(product.id)} className="p-1">
                    <X size={40} strokeWidth={1} />
                </button>
                <button onClick={handleShoppingBagClick} className="bg-[#3B5345] rounded-full p-2">
                    <ShoppingBag width={40} height={40} />
                </button>
            </div>
        </motion.div>
    );
});
WishlistItem.displayName = "WishlistItem"
export default WishlistItem;