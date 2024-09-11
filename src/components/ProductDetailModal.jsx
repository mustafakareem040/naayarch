'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNotification } from "@/components/NotificationContext";
import '@/components/NotificationStyles.css';
import Link from "next/link";

const ProductModal = ({ isOpen, onClose, productData }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const [totalPrice, setTotalPrice] = useState(0);
    const { addNotification } = useNotification();

    const product = productData.product;

    useEffect(() => {
        if (product && product.sizes && product.sizes.length > 0) {
            setSelectedSize(product.sizes[0]);
        }
    }, [product]);

    useEffect(() => {
        updateTotalPrice();
    }, [selectedSize, quantity]);

    useEffect(() => {
        checkIfInCart();
    }, [selectedSize]);

    const updateTotalPrice = useCallback(() => {
        if (selectedSize) {
            setTotalPrice(parseFloat(selectedSize.price) * quantity);
        }
    }, [selectedSize, quantity]);

    const checkIfInCart = useCallback(() => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isItemInCart = cart.some(item =>
            item.product_id === product.id &&
            item.size_id === selectedSize?.id
        );
        setIsInCart(isItemInCart);
    }, [product.id, selectedSize]);

    const handleAddToCart = useCallback(() => {
        if (selectedSize) {
            const cartItem = {
                product_id: product.id,
                size_id: selectedSize.id,
                qty: quantity,
                price: selectedSize.price
            };

            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(item =>
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
            checkIfInCart();
        }
    }, [product.id, selectedSize, quantity, addNotification]);

    if (!isOpen || !product) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed font-serif inset-0 bg-black bg-opacity-30 flex items-end justify-center z-50"
                onClick={onClose}
            >
                <motion.div
                    initial={{ y: "100%" }}
                    animate={{ y: 0 }}
                    exit={{ y: "100%" }}
                    transition={{ type: "spring", damping: 25, stiffness: 500 }}
                    className="bg-white rounded-t-3xl w-full p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="w-9 h-1 bg-[#00003C] opacity-70 rounded-full mx-auto mb-6" />

                    <h2 className="text-xl mb-4 font-sans">{product.name}</h2>

                    {product.has_size && (
                        <div className="mb-4">
                            <select
                                value={selectedSize ? selectedSize.id : ''}
                                onChange={(e) => setSelectedSize(product.sizes.find(size => size.id.toString() === e.target.value))}
                                className="w-44 p-2 border border-[rgba(105,92,92,0.5)] rounded-lg font-serif text-lg"
                            >
                                <option value="" disabled={true}>Select a Size</option>
                                {product.sizes.map((size) => (
                                    <option key={size.id} value={size.id}>
                                        {size.name}
                                    </option>
                                ))}
                            </select>
                            {!selectedSize && (
                                <p className="text-[#C91C1C] text-xs mt-2 font-sans">Please choose Size</p>
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
                                            selectedSize && selectedSize.color_id === color.id ? 'border-[rgba(105,92,92,0.5)]' : 'border-transparent'
                                        } flex items-center justify-center`}
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
                                    <span key={color.id} className="text-sm font-serif">{color.name}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-6">
                        <p className="text-2xl font-medium">
                            {totalPrice.toFixed(2)} IQD
                        </p>
                        <div className="flex items-center space-x-4">
                            <button
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            >
                                <Minus size={20} />
                            </button>
                            <span className="text-xl">{quantity}</span>
                            <button
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center"
                                onClick={() => setQuantity(quantity + 1)}
                            >
                                <Plus size={20} />
                            </button>
                        </div>
                    </div>

                    <div className="flex space-x-4">
                        {isInCart ? (
                            <Link
                                href="/cart"
                                prefetch={false}
                                className="flex-1 font-serif bg-[rgba(59,83,69,0.05)] text-[#3B5345] py-3 rounded-lg font-medium text-base md:text-lg flex items-center justify-center transition duration-300 border border-[#3B5345]"
                            >
                                <ShoppingCart className="mr-2" />
                                Buy Now
                            </Link>
                        ) : (
                            <button
                                className={`flex-1 ${selectedSize ? 'bg-[#3B5345] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'} py-3 rounded-lg font-medium text-base md:text-lg flex items-center justify-center`}
                                onClick={handleAddToCart}
                                disabled={!selectedSize}
                            >
                                <ShoppingCart className="mr-2" />
                                Add To Cart
                            </button>
                        )}
                        <button
                            className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium text-base md:text-lg"
                            onClick={onClose}
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