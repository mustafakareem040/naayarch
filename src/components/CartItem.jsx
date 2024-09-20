import React from 'react';
import Image from 'next/image';
import { Plus, Minus } from 'lucide-react';

const CartItem = ({ id, title, color, image, size, qty, originalPrice, discountedPrice, onUpdateQuantity, onRemove }) => {
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
        <div className="flex flex-col sm:flex-row gap-4 justify-between font-serif items-stretch p-5 bg-white shadow rounded-lg mb-6">
            <div className="w-full sm:w-1/3 relative aspect-[4/5] bg-gray-100 rounded-lg overflow-hidden">
                <Image
                    src={image}
                    alt={title}
                    fill={true}
                    unoptimized={true}
                    className="object-cover"
                />
            </div>

            <div className="flex flex-col justify-between w-full sm:w-2/3">
                <div>
                    <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
                    {color && <p className="text-sm text-gray-600">Color: <span className="font-medium">{color}</span></p>}
                    {size && <p className="text-sm text-gray-600">Size: <span className="font-medium">{size}</span></p>}
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center space-x-2">
                        <button
                            onClick={handleDecrement}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                            <Minus size={16} className="text-gray-700" />
                        </button>
                        <span className="font-medium">{qty}</span>
                        <button
                            onClick={handleIncrement}
                            className="w-8 h-8 flex items-center justify-center bg-gray-200 rounded-full hover:bg-gray-300 transition"
                        >
                            <Plus size={16} className="text-gray-700" />
                        </button>
                    </div>
                    <button
                        onClick={() => onRemove(id)}
                        className="text-red-500 hover:text-red-700 transition text-sm"
                    >
                        Remove
                    </button>
                </div>

                <div className="mt-4">
                    {discountedPrice < originalPrice ? (
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-500 line-through">{originalPrice} IQD</span>
                            <span className="text-lg font-semibold text-green-600">{discountedPrice} IQD</span>
                        </div>
                    ) : (
                        <span className="text-lg font-semibold text-gray-800">{originalPrice} IQD</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CartItem;