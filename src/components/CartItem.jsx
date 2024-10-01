import React, { useCallback } from 'react';
import Image from 'next/image';
import { ChevronDown, Plus, Minus } from 'lucide-react';
import {removeFileExtension} from "@/lib/api";

const CartItem = React.memo(({ id, title, color, image, size, qty, availableQty, originalPrice, discountedPrice, onUpdateQuantity, onRemove }) => {
    const isOutOfStock = availableQty < 1;
    const canIncrement = qty < availableQty;
    const canDecrement = qty > 1;

    const handleIncrement = useCallback(() => {
        if (canIncrement) {
            onUpdateQuantity(id, qty + 1);
        }
    }, [id, qty, canIncrement, onUpdateQuantity]);

    const handleDecrement = useCallback(() => {
        if (canDecrement) {
            onUpdateQuantity(id, qty - 1);
        } else {
            onRemove(id);
        }
    }, [id, qty, canDecrement, onUpdateQuantity, onRemove]);

    return (
        <div className="flex gap-2 justify-between font-serif items-stretch p-4 bg-[rgba(246,243,241,0.3)] shadow-[0px_2px_4px_3px_rgba(0,0,0,0.1)] rounded-md mb-4 w-full">
            <div className="w-full max-h-[300px] relative aspect-[4/5] ssm:w-1/2 bg-transparent rounded-lg overflow-hidden">
                <Image
                    src={`${removeFileExtension(image)}_optimized.webp`}
                    alt={title}
                    fill={true}
                    unoptimized={true}
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col items-center gap-3 w-[120px]">
                <h3 className="font-semibold text-sm text-center leading-tight">{title}</h3>
                {color !== 'N/A' && <p className="text-sm text-center">Color: {color}</p>}
                {size !== 'N/A' && <p className="text-sm text-center">Size: {size}</p>}
                <div className="flex items-center justify-between w-[96px] h-6 bg-[#F6F3F1] rounded-lg px-3">
                    <span className="text-sm">Qty: {qty}</span>
                    <ChevronDown size={16} />
                </div>
                <div className="text-center">
                    {isOutOfStock ? (
                        <p className="text-red-500 font-sans font-medium text-sm">Out of Stock</p>
                    ): ""}
                </div>
                {/**/}
                <div className="text-center">
                    {discountedPrice < originalPrice ? (
                        <>
                            <span className="line-through text-gray-500 text-sm">{originalPrice.toLocaleString()} IQD</span>
                            <br />
                            <span className="text-green-600 font-semibold text-sm">{discountedPrice.toLocaleString()} IQD</span>
                        </>
                    ) : (
                        <span className="font-semibold text-sm">{originalPrice.toLocaleString()} IQD</span>
                    )}
                </div>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <button
                    onClick={handleIncrement}
                    className={`w-[41px] h-[40px] flex items-center justify-center bg-[#3B5345] rounded-lg ${!canIncrement ? 'opacity-50 cursor-not-allowed' : ''}`}
                    aria-label={`Increase quantity of ${title}`}
                    disabled={!canIncrement}
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={handleDecrement}
                    className="w-[41px] h-[40px] flex items-center justify-center bg-white border border-[rgba(105,92,92,0.5)] rounded-lg"
                    aria-label={`Decrease quantity of ${title}`}
                >
                    <Minus className="w-6 h-6 text-[#695C5C]" />
                </button>
            </div>
        </div>
    );
});
CartItem.displayName = "CartItem"
export default CartItem;