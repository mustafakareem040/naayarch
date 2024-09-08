import React from 'react';
import Image from 'next/image';
import { ChevronDown, Plus, Minus } from 'lucide-react';

const CartItem = ({ id, title, color, image, size, qty, price, onUpdateQuantity, onRemove }) => {
    const handleIncrement = () => {
        onUpdateQuantity(id, qty + 1);
    };

    const handleDecrement = () => {
        if (qty > 1) {
            onUpdateQuantity(id, qty - 1);
        } else {
            onRemove(id);
        }
    };

    return (
        <div className="flex justify-between font-serif items-stretch p-4 bg-[rgba(246,243,241,0.3)] shadow-[0px_2px_4px_3px_rgba(0,0,0,0.1)] rounded-md mb-4 w-full">
            <div className="w-full relative aspect-[2/3] ssm:w-1/2 bg-transparent rounded-lg overflow-hidden">
                <Image
                    src={`https://storage.naayiq.com/products/${image}`}
                    alt={title}
                    fill={true}
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col items-center gap-3 w-[120px]">
                <h3 className="font-semibold text-sm text-center leading-tight">{title}</h3>
                {color ? <p className="text-sm text-center">Color:{color}</p> : ""}
                {size ? <p className="text-sm text-center">Size:{size}</p> : ""}
                <div className="flex items-center justify-between w-[86px] h-6 bg-[#F6F3F1] rounded-lg px-3">
                    <span className="text-sm">Qty:{qty}</span>
                    <ChevronDown size={16} />
                </div>
                <p className="font-semibold text-sm text-center">{price}</p>
            </div>

            <div className="flex flex-col justify-between gap-2">
                <button
                    onClick={handleIncrement}
                    className="w-[41px] h-[40px] flex items-center justify-center bg-[#3B5345] rounded-lg"
                >
                    <Plus className="w-6 h-6 text-white" />
                </button>
                <button
                    onClick={handleDecrement}
                    className="w-[41px] h-[40px] flex items-center justify-center bg-white border border-[rgba(105,92,92,0.5)] rounded-lg"
                >
                    <Minus className="w-6 h-6 text-[#695C5C]" />
                </button>
            </div>
        </div>
    );
};

export default CartItem;