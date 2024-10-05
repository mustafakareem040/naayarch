'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useNotification } from '@/components/NotificationContext';
import '@/components/NotificationStyles.css';
import Link from 'next/link';
import WishlistHeart from '@/components/WishlistHeart';
import Image from 'next/image';

const formatPrice = (price) => {
    if (price == null || price === Infinity) return 'N/A';
    const formattedPrice = price >= 10000 ? price.toLocaleString() : price.toString();
    return `${formattedPrice} IQD`;
};

const ProductModal = ({ isOpen, onClose, productData }) => {
    const [selectedSize, setSelectedSize] = useState(null);
    const [selectedColor, setSelectedColor] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [isInCart, setIsInCart] = useState(false);
    const { addNotification } = useNotification();
    const [colorImages, setColorImages] = useState({});
    const [maxQuantity, setMaxQuantity] = useState(0);

    // Handle different product data structures
    const product = productData.product || productData;

    // Fetch color images similar to ProductDetail
    useEffect(() => {
        const fetchColorImages = async () => {
            if (!product.has_color || product.colors.length === 0) {
                setColorImages({});
                return;
            }

            const updatedColorImages = {};
            await Promise.all(product.colors.map(async (color) => {
                try {
                    const response = await fetch(`https://dev.naayiq.com/colors/${encodeURIComponent(color.name)}`);
                    const data = await response.json();
                    if (data.url) {
                        updatedColorImages[color.id] = `https://storage.naayiq.com/resources/${data.url}`;
                    } else {
                        updatedColorImages[color.id] = null; // Image not found
                    }
                } catch (error) {
                    console.error(`Error fetching image for color ${color.name}:`, error);
                    updatedColorImages[color.id] = null; // On error, treat as not found
                }
            }));
            setColorImages(updatedColorImages);
        };

        fetchColorImages();
    }, [product.colors, product.has_color]);

    // Initialize selections when modal opens or product changes
    useEffect(() => {
        if (!isOpen) return;

        const initializeSelections = () => {
            if (product.has_color && product.colors.length > 0) {
                // Select default color (first available)
                const defaultColor = product.colors.find(color => color.qty > 0 || (color.has_size && color.sizes.some(size => size.qty > 0))) || product.colors[0];
                setSelectedColor(defaultColor);

                // If the selected color has sizes, select the first available size
                if (defaultColor.has_size && defaultColor.sizes.length > 0) {
                    const defaultSize = defaultColor.sizes.find(size => size.qty > 0) || defaultColor.sizes[0];
                    setSelectedSize(defaultSize);
                } else {
                    setSelectedSize(null);
                }
            } else if (product.has_size && product.sizes.length > 0) {
                // For products without colors but with sizes
                const defaultSize = product.sizes.find(size => size.qty > 0) || product.sizes[0];
                setSelectedSize(defaultSize);
                setSelectedColor(null);
            } else {
                // Products without color and size
                setSelectedColor(null);
                setSelectedSize(null);
            }

            setQuantity(1);
        };

        initializeSelections();
    }, [product, isOpen]);

    // Determine max quantity based on selected attributes
    useEffect(() => {
        if (selectedSize) {
            setMaxQuantity(selectedSize.qty);
        } else if (selectedColor) {
            setMaxQuantity(selectedColor.qty);
        } else {
            setMaxQuantity(product.qty);
        }

        // Adjust quantity if it exceeds maxQuantity
        if (quantity > maxQuantity) {
            setQuantity(maxQuantity > 0 ? maxQuantity : 1);
        }
    }, [selectedSize, selectedColor, product.qty, quantity, maxQuantity]);

    // Compute total price dynamically
    const totalPrice = useMemo(() => {
        let price = product.price;

        if (selectedSize && selectedSize.price) {
            price = selectedSize.price;
        } else if (selectedColor && selectedColor.price) {
            price = selectedColor.price;
        }

        return parseFloat(price) * quantity;
    }, [product.price, selectedSize, selectedColor, quantity]);

    // Check if the product is in the cart
    const checkIfInCart = useCallback(() => {
        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const isItemInCart = cart.some(
                (item) =>
                    item.product_id === product.id &&
                    item.size_id === (selectedSize ? selectedSize.id : null) &&
                    item.color_id === (selectedColor ? selectedColor.id : null)
            );
            setIsInCart(isItemInCart);
        } catch (error) {
            console.error('Error accessing localStorage:', error);
            setIsInCart(false);
        }
    }, [product.id, selectedSize, selectedColor]);

    // Check if the product is in the cart whenever selectedSize or selectedColor changes
    useEffect(() => {
        checkIfInCart();
    }, [selectedSize, selectedColor, checkIfInCart]);

    // Handle adding product to cart
    const handleAddToCart = useCallback(() => {
        if ((product.has_size && !selectedSize) || (product.has_color && !selectedColor)) {
            addNotification('error', 'Please select the required options');
            return;
        }

        if (maxQuantity === 0) {
            addNotification('error', 'Selected option is out of stock');
            return;
        }

        const cartItem = {
            product_id: product.id,
            size_id: selectedSize ? selectedSize.id : null,
            color_id: selectedColor ? selectedColor.id : null,
            qty: quantity,
            price: selectedSize ? selectedSize.price : (selectedColor ? selectedColor.price : product.price),
        };

        try {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            const existingItemIndex = cart.findIndex(
                (item) =>
                    item.product_id === cartItem.product_id &&
                    item.size_id === cartItem.size_id &&
                    item.color_id === cartItem.color_id
            );

            if (existingItemIndex > -1) {
                const newQty = cart[existingItemIndex].qty + quantity;
                if (newQty > maxQuantity) {
                    addNotification('error', `Cannot add more than ${maxQuantity} items`);
                    return;
                }
                cart[existingItemIndex].qty = newQty;
            } else {
                if (quantity > maxQuantity) {
                    addNotification('error', `Cannot add more than ${maxQuantity} items`);
                    return;
                }
                cart.push(cartItem);
            }

            localStorage.setItem('cart', JSON.stringify(cart));
            setIsInCart(true);
            addNotification('success', 'Added to cart successfully');
        } catch (error) {
            console.error('Error updating cart:', error);
            addNotification('error', 'Failed to add to cart');
        }
    }, [product, selectedSize, selectedColor, quantity, addNotification, maxQuantity]);

    if (!isOpen || !product) return null;

    // Determine button disabled states
    const isDecreaseDisabled = (maxQuantity > 0 && quantity <= 1) || (maxQuantity === 0 && quantity === 0);
    const isIncreaseDisabled = quantity >= maxQuantity;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 font-serif bg-black bg-opacity-30 flex items-end justify-center z-50"
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
                    {/* Close Button */}
                    <button
                        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                        onClick={onClose}
                        aria-label="Close modal"
                    >
                        {/* You can use an icon here, e.g., X or any close icon */}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none"
                             viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M6 18L18 6M6 6l12 12"/>
                        </svg>
                    </button>

                    {/* Modal Content */}
                    <div className="w-9 h-1 bg-[#00003C] opacity-70 rounded-full mx-auto mb-6" />

                    {/* Product Name */}
                    <h2 className="text-xl mb-4 font-sans">{product.name}</h2>

                    {/* Product Price */}


                    {/* Color Selection */}
                    {product.has_color && product.colors.length > 0 && (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">Color</h3>
                            <div className="flex space-x-4 overflow-x-auto pb-2">
                                {product.colors.map((color) => (
                                    <div key={color.id} className="flex flex-col items-center">
                                        <button
                                            className={`w-12 h-12 rounded-full border-2 ${selectedColor?.id === color.id ? 'border-[#3B5345]' : 'border-[#695C5C] border-opacity-50'} mb-1 overflow-hidden`}
                                            onClick={() => {
                                                setSelectedColor(color);
                                                if (color.has_size && color.sizes.length > 0) {
                                                    const availableSize = color.sizes.find(size => size.qty > 0) || color.sizes[0];
                                                    setSelectedSize(availableSize);
                                                } else {
                                                    setSelectedSize(null);
                                                }
                                            }}
                                            disabled={color.qty === 0 && !color.has_size}
                                            aria-label={`Select color ${color.name}`}
                                        >
                                            {/* Render fetched color image or fallback to color name initial */}
                                            {colorImages[color.id] ? (
                                                <Image
                                                    src={colorImages[color.id]}
                                                    alt={color.name}
                                                    width={48}
                                                    height={48}
                                                    className="object-cover"
                                                />
                                            ) : (
                                                <span className="text-sm text-gray-500 capitalize">
                                                    {color.name.charAt(0)}
                                                </span>
                                            )}
                                        </button>
                                        <span className="text-sm capitalize">{color.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Size Selection */}
                    {(product.has_size && product.sizes.length > 0) || (selectedColor && selectedColor.has_size && selectedColor.sizes.length > 0) ? (
                        <div className="mb-4">
                            <h3 className="text-lg font-medium mb-2">Size</h3>
                            <select
                                value={selectedSize ? selectedSize.id : ''}
                                onChange={(e) => {
                                    const sizeId = parseInt(e.target.value);
                                    const availableSizes = selectedColor && selectedColor.has_size ? selectedColor.sizes : product.sizes;
                                    const newSize = availableSizes.find(size => size.id === sizeId);
                                    setSelectedSize(newSize);
                                }}
                                className="w-fit p-2 border border-gray-300 rounded-lg"
                                aria-label="Select size"
                            >
                                <option value="" disabled>Select Size</option>
                                {(selectedColor && selectedColor.has_size ? selectedColor.sizes : product.sizes).map((size) => (
                                    <option key={size.id} value={size.id} disabled={size.qty === 0}>
                                        {size.name} {size.qty === 0 && '(Out of Stock)'}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : null}

                    {/* Quantity Selector */}
                    <div className="flex items-center justify-between mb-4">
                        {!isNaN(totalPrice) && (
                            <p className="text-lg mb-4">{formatPrice(totalPrice)}</p>
                        )}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className={`w-8 h-8 flex items-center justify-center border ${isDecreaseDisabled ? 'border-gray-300 cursor-not-allowed' : 'border-[#3B5345]'} rounded-full`}
                                disabled={isDecreaseDisabled}
                                aria-label="Decrease quantity"
                            >
                                <Minus className="w-4 h-4 text-[#3B5345]" />
                            </button>
                            <span className="text-lg">{quantity}</span>
                            <button
                                onClick={() => setQuantity(prev => Math.min(prev + 1, maxQuantity))}
                                className={`w-8 h-8 flex items-center justify-center border ${isIncreaseDisabled ? 'border-gray-300 cursor-not-allowed' : 'border-[#3B5345]'} rounded-full`}
                                disabled={isIncreaseDisabled}
                                aria-label="Increase quantity"
                            >
                                <Plus className="w-4 h-4 text-[#3B5345]" />
                            </button>
                        </div>
                    </div>


                    {/* Add to Cart / Buy Now Buttons */}
                    <div className="flex text-xl space-x-4">
                        {isInCart ? (
                            <Link
                                href="/cart"
                                className="flex-1 bg-[rgba(59,83,69,0.05)] text-[#3B5345] py-3.5 rounded-lg flex items-center justify-center border border-[#3B5345] hover:bg-[rgba(59,83,69,0.1)] transition"
                            >
                                <ShoppingCart className="mr-2" />
                                Buy Now
                            </Link>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className={`flex-1 flex items-center justify-center py-3.5 rounded-lg text-white ${
                                    (product.has_size && !selectedSize) || (product.has_color && !selectedColor) || maxQuantity === 0
                                        ? 'bg-gray-400 cursor-not-allowed'
                                        : 'bg-[#3B5345] hover:bg-[#2d4233]'
                                } transition`}
                                disabled={
                                    (product.has_size && !selectedSize) ||
                                    (product.has_color && !selectedColor) ||
                                    maxQuantity === 0
                                }
                                aria-label="Add to cart"
                            >
                                <ShoppingCart className="mr-2" />
                                Add to Cart
                            </button>
                        )}
                        <button
                            onClick={onClose}
                            className="flex-1 bg-gray-200 text-gray-800 py-3.5 rounded-lg hover:bg-gray-300 transition"
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