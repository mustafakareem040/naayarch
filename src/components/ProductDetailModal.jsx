'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNotification } from '@/components/NotificationContext';
import '@/components/NotificationStyles.css';
import Link from 'next/link';

const formatPrice = (price) => {
    if (price == null || price === Infinity) return 'N/A';
    const formattedPrice = price >= 10000 ? price.toLocaleString() : price.toString();
    return `${formattedPrice} IQD`;
};

const ProductModal = ({ isOpen, onClose, productData }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const { addNotification } = useNotification();

    const product = productData.product;

    // Compute total price dynamically
    const totalPrice = useMemo(() => {
        return selectedSize ? parseFloat(selectedSize.price) * quantity : 0;
    }, [selectedSize, quantity]);

    // Check if the product is in the cart
    const checkIfInCart = useCallback(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const isItemInCart = cart.some(
                (item) =>
                    item.product_id === product.id &&
                    item.size_id === selectedSize?.id
            );
            setIsInCart(isItemInCart);
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            setIsInCart(false);
        }
    }, [product.id, selectedSize]);

    // Set default selected size on product change
    useEffect(() => {
        if (product?.sizes?.length > 0) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product]);

    // Check if the product is in the cart whenever selectedSize changes
    useEffect(() => {
        checkIfInCart();
    }, [selectedSize, checkIfInCart]);

    // Handle adding product to cart
    const handleAddToCart = useCallback(() => {
        if (!selectedSize) return;

        const cartItem = {
            product_id: product.id,
            size_id: selectedSize.id,
            qty: quantity,
            price: selectedSize.price,
        };

        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product_id === cartItem.product_id &&
                    item.size_id === cartItem.size_id
            );

            if (existingItemIndex > -1) {
                cart[existingItemIndex].qty += quantity;
            } else {
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            setIsInCart(true);
            addNotification('success', 'Added to cart successfully');
        } catch (error) {
            console.error('Error updating cart:', error);
            addNotification('error', 'Failed to add to cart');
        }
    }, [product.id, selectedSize, quantity, addNotification]);

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50"
                onClick={onClose}
                aria-modal="true"
                role="dialog"
            >
                <motion.div
                    initial={{ y: '100%' }}
                    animate={{ y: 0 }}
                    exit={{ y: '100%' }}
                    transition={{ type: 'spring', damping: 25, stiffness: 500 }}
                    className="bg-white rounded-t-3xl w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-9 h-1 bg-[#00003C] opacity-70 rounded-full mx-auto mb-6" />

                    <h2 className="text-xl mb-4 font-sans">{product.name}</h2>

                    {product.has_size && (
                        <div className="mb-4">
                            <label htmlFor="size-select" className="sr-only">
                                Select Size
                            </label>
                            <select
                                id="size-select"
                                value={selectedSize ? selectedSize.id : ''}
                                onChange={(e) =>
                                    setSelectedSize(
                                        product.sizes.find(
                                            (size) => size.id.toString() === e.target.value
                                        )
                                    )
                                }
                                className="w-44 p-2 border border-[rgba(105,92,92,0.5)] rounded-lg font-serif text-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="" disabled>
                                    Select a Size
                                </option>
                                {product.sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                            {!selectedSize && (
                                <p className="text-[#C91C1C] text-xs mt-2 font-sans">
                                    Please choose Size
                                </p>
                            )}
                        </div>
                    )}

                    {product.has_color && product.colors && product.colors.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-medium mb-2 font-sans">Color</h3>
                            <div className="flex space-x-5 mb-2">
                                {product.colors.map((color) => (
                                    <button
                                        key={color.id}
                                        className={`w-20 h-20 rounded-full border-2 ${
                                            selectedSize && selectedSize.color_id === color.id
                                                ? 'border-[rgba(105,92,92,0.5)]'
                                                : 'border-transparent'
                                        } flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                        aria-label={`Select color ${color.name}`}
                                        onClick={() => {
                                            // Assuming color selection affects selectedSize
                                            // If not, consider adding a separate state for selectedColor
                                        }}
                                    >
                                        <div
                                            className="w-15 h-15 rounded-full"
                                            style={{ backgroundColor: color.hex }}
                                        />
                                    </button>
                                ))}
                            </div>
                            <div className="flex justify-between px-2">
                                {product.colors.map((color) => (
                                    <span key={color.id} className="text-sm font-serif">
                                        {color.name}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex font-serif justify-between items-center mb-6">
                        <p className="text-lg font-medium">{formatPrice(totalPrice)}</p>
                        <div className="flex items-center space-x-4">
                            <button
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
                                onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-4 h-4 text-[#3B5345]" />
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                                onClick={() => setQuantity((prev) => prev + 1)}
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-4 h-4 text-[#3B5345]" />
                            </button>
                        </div>
                    </div>

                    <div className="flex font-serif space-x-4">
                        {isInCart ? (
                            <Link
                                href="/cart"
                                prefetch={false}
                                className="flex-1 font-serif bg-[rgba(59,83,69,0.05)] text-[#3B5345] py-3 rounded-lg font-medium text-base md:text-lg flex items-center justify-center transition duration-300 border border-[#3B5345] hover:bg-[rgba(59,83,69,0.1)]"
                            >
                                <ShoppingCart className="mr-2" />
                                Buy Now
                            </Link>
                        ) : (
                            <button
                                className={`flex-1 ${
                                    selectedSize
                                        ? 'bg-[#3B5345] text-white hover:bg-[#2d4233]'
                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                } py-3 rounded-lg font-medium text-base md:text-lg flex items-center justify-center transition duration-300`}
                                onClick={handleAddToCart}
                                disabled={!selectedSize}
                                aria-label="Add to cart"
                            >
                                <ShoppingCart className="mr-2" />
                                Add To Cart
                            </button>
                        )}
                        <button
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium text-base md:text-lg hover:bg-gray-300 transition duration-300"
                            onClick={onClose}
                            aria-label="Close modal"
                        >
                            Close
                        </button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default React.memo(ProductModal);