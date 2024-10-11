'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CartItem from './CartItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import EmptyCart from "@/components/EmptyCart";
import { CircleArrowLeft } from "lucide-react";
import { useNotification } from '@/components/NotificationContext';
import "./NotificationStyles.css";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [delivery] = useState(5000);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [appliedCouponId, setAppliedCouponId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [isOrderSet, setIsOrderSet] = useState(false);
    const [confirmationAction, setConfirmationAction] = useState(null);
    const [couponDetails, setCouponDetails] = useState(null);
    const [minimum, setMinimum] = useState(0)
    const router = useRouter();
    const { addNotification } = useNotification();

    const fetchCartItems = useCallback(async () => {
        try {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            if (storedCart.length === 0) {
                setIsLoading(false);
                return;
            }

            const uniqueProductIds = [...new Set(storedCart.map(item => item.product_id))];
            const productDetailsMap = {};
            const failedProductIds = [];

            await Promise.all(uniqueProductIds.map(async (productId) => {
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${productId}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch product ${productId}: ${response.statusText}`);
                    }
                    const data = await response.json();
                    productDetailsMap[productId] = data.product;
                } catch (error) {
                    failedProductIds.push(productId);
                    addNotification('error', `Error fetching product ${productId}. It will be removed from your cart.`);
                }
            }));

            if (failedProductIds.length > 0) {
                const updatedStoredCart = storedCart.filter(item => !failedProductIds.includes(item.product_id));
                localStorage.setItem('cart', JSON.stringify(updatedStoredCart));
            }

            const itemsWithDetails = storedCart.map(item => {
                const product = productDetailsMap[item.product_id];
                if (!product) {
                    return null;
                }

                let selectedSize, selectedColor, availableQty, price;

                if (product.has_color && item.color_id) {
                    selectedColor = product.colors.find(color => color.id === item.color_id);
                    if (selectedColor) {
                        if (selectedColor.has_size && item.size_id) {
                            selectedSize = selectedColor.sizes.find(size => size.id === item.size_id);
                            if (selectedSize) {
                                availableQty = selectedSize.qty;
                                price = selectedSize.price;
                            }
                        } else {
                            availableQty = selectedColor.qty;
                            price = selectedColor.price;
                        }
                    }
                } else if (product.has_size && item.size_id) {
                    selectedSize = product.sizes.find(size => size.id === item.size_id);
                    if (selectedSize) {
                        availableQty = selectedSize.qty;
                        price = selectedSize.price;
                    }
                }

                if (!availableQty && !price) {
                    availableQty = product.qty;
                    price = product.price;
                }

                return {
                    ...item,
                    cartItemId: `${item.product_id}-${item.color_id || 'nocolor'}-${item.size_id || 'nosize'}`,
                    title: product.name,
                    image: product.images.length > 0
                        ? `https://storage.naayiq.com/resources/${product.images[0].url}`
                        : 'https://storage.naayiq.com/resources/noimage.webp',
                    price: parseInt(price, 10),
                    color: selectedColor?.name || 'N/A',
                    size: selectedSize?.name || 'N/A',
                    availableQty: availableQty,
                };
            }).filter(item => item !== null);

            setCartItems(itemsWithDetails);
        } catch (error) {
            addNotification('error', 'Failed to load cart items.');
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            fetchCartItems();
        }
    }, [fetchCartItems]);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
        setSubTotal(total);
    }, [cartItems]);


    const handleUpdateQuantity = useCallback((cartItemId, newQty) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item => {
                if (item.cartItemId === cartItemId) {
                    const finalQty = Math.min(newQty, item.availableQty);
                    return { ...item, qty: finalQty };
                }
                return item;
            });
            try {
                localStorage.setItem('cart', JSON.stringify(updatedItems.map(({ cartItemId, ...item }) => item)));
            } catch (error) {
                addNotification('error', 'Failed to update cart in localStorage.');
            }
            return updatedItems;
        });
    }, [addNotification]);

    const handleRemoveItem = useCallback((cartItemId) => {
        setConfirmationMessage('Are you sure you want to remove this item from your cart?');
        setConfirmationAction(() => () => {
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.cartItemId !== cartItemId);
                try {
                    localStorage.setItem('cart', JSON.stringify(updatedItems.map(({ cartItemId, ...item }) => item)));
                } catch (error) {
                    addNotification('error', 'Failed to update cart in localStorage.');
                }
                return updatedItems;
            });
            setShowConfirmation(false);
        });
        setShowConfirmation(true);
    }, [addNotification]);

    const calculateDiscount = useCallback((couponDetails, subtotal) => {
        if (couponDetails.discount_percentage) {
            const discountAmount = subtotal * (couponDetails.discount_percentage / 100);
            return Math.min(discountAmount, couponDetails.max_discount_amount || Infinity);
        } else if (couponDetails.discount_amount) {
            return Math.min(couponDetails.discount_amount, subtotal);
        }
        return 0;
    }, []);

    const handleApplyCoupon = useCallback(async () => {
        if (appliedCoupon) {
            setConfirmationMessage('Are you sure you want to remove the applied coupon?');
            setConfirmationAction(() => () => {
                setAppliedCoupon(null);
                setAppliedCouponId(null);
                setDiscount(0);
                setCoupon('');
                setCouponMessage('');
                setCouponDetails(null);
                setShowConfirmation(false);
                addNotification('success', 'Coupon removed successfully.');
            });
            setShowConfirmation(true);
        } else {
            if (!coupon.trim()) {
                addNotification('error', 'Please enter a coupon code.');
                return;
            }
            setIsApplyingCoupon(true);
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/coupons/${encodeURIComponent(coupon.trim())}/activate`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ price: subTotal })
                });
                const data = await response.json();

                if (response.ok) {
                    const calculatedDiscount = calculateDiscount(data.coupon, subTotal);
                    setDiscount(calculatedDiscount);
                    setAppliedCoupon(data.coupon.code);
                    setAppliedCouponId(data.coupon.id);
                    setCouponDetails(data.coupon);
                    setCouponMessage(data.message || 'Coupon applied successfully!');
                } else {
                    setCouponMessage(data.message || "Invalid coupon code");
                }
            } catch (error) {
                setCouponMessage("Error applying coupon. Please try again.");
            } finally {
                setIsApplyingCoupon(false);
            }
        }
    }, [appliedCoupon, coupon, subTotal, calculateDiscount, addNotification]);


    useEffect(() => {
        if (couponDetails) {
            if (subTotal < couponDetails.min_purchase_amount) {
                setDiscount(0)
                return;
            }
            const newDiscount = calculateDiscount(couponDetails, subTotal);
            setDiscount(newDiscount);
        }
    }, [subTotal, couponDetails, calculateDiscount]);

    const totalPrice = useMemo(() => {
        const discountedTotal = subTotal - discount;
        return Math.max(discountedTotal, 0);
    }, [subTotal, discount]);

    const cartItemsWithDiscount = useMemo(() => {
        if (discount <= 0) {
            return cartItems.map(item => ({
                ...item,
                originalTotal: item.price * (item.qty || 1),
                discountedTotal: item.price * (item.qty || 1),
            }));
        }

        return cartItems.map(item => {
            const itemTotal = item.price * (item.qty || 1);
            const itemShare = subTotal ? itemTotal / subTotal : 0;
            const itemDiscount = Math.round(discount * itemShare);
            const discountedTotal = itemTotal - itemDiscount;
            return {
                ...item,
                originalTotal: itemTotal,
                discountedTotal: discountedTotal,
            };
        });
    }, [cartItems, discount, subTotal]);

    const handleProceed = useCallback(() => {
        const outOfStockItems = cartItems.filter(item => item.availableQty < (item.qty || 1));
        if (outOfStockItems.length > 0) {
            addNotification('error', 'Some items are out of stock or do not have sufficient quantity.');
            return;
        }

        const orderData = {
            coupon_id: appliedCouponId,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id || null,
                color_id: item.color_id || null,
                quantity: item.qty || 1,
            })),
            info: { delivery, discount, subTotal },
        };

        try {
            localStorage.setItem('orderData', JSON.stringify(orderData));
            setIsOrderSet(true);
        } catch (error) {
            addNotification('error', 'Failed to set order data. Please try again.');
        }
    }, [appliedCouponId, cartItems, delivery, discount, subTotal, addNotification]);

    useEffect(() => {
        if (isOrderSet) {
            router.push('/cart/order');
            setIsOrderSet(false);
        }
    }, [isOrderSet, router]);

    const handleConfirm = useCallback(() => {
        if (confirmationAction) {
            confirmationAction();
            setConfirmationAction(null);
        }
    }, [confirmationAction]);

    const handleCancelConfirmation = useCallback(() => {
        setShowConfirmation(false);
        setConfirmationAction(null);
    }, []);

    const hasOutOfStock = useMemo(() => {
        return cartItems.some(item => item.availableQty < (item.qty || 1));
    }, [cartItems]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        cartItems.length === 0 ? <EmptyCart /> :
            <>
                <header className="flex items-center mb-6">
                    <button
                        onClick={() => router.push("/")}
                        className="p-2 relative z-20 cursor-pointer"
                        aria-label="Go back"
                    >
                        <CircleArrowLeft size={52} strokeWidth={0.7} />
                    </button>
                    <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                        Cart
                    </h1>
                </header>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 overflow-x-hidden font-serif container mx-auto relative"
                >
                    <AnimatePresence>
                        {showConfirmation && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
                            >
                                <motion.div
                                    initial={{ scale: 0.9 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0.9 }}
                                    className="bg-white p-4 rounded-lg shadow-lg"
                                >
                                    <p className="mb-4">{confirmationMessage}</p>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={handleCancelConfirmation}
                                            className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                            aria-label="Cancel confirmation"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleConfirm}
                                            className="bg-red-500 text-white px-4 py-2 rounded"
                                            aria-label="Confirm action"
                                        >
                                            Confirm
                                        </button>
                                    </div>
                                </motion.div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <AnimatePresence>
                        {cartItemsWithDiscount.map(item => (
                            <motion.div
                                key={item.cartItemId}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <CartItem
                                    id={item.cartItemId}
                                    title={item.title}
                                    color={item.color}
                                    image={item.image}
                                    size={item.size}
                                    qty={item.qty || 1}
                                    availableQty={item.availableQty}
                                    originalPrice={item.originalTotal}
                                    discountedPrice={item.discountedTotal}
                                    onUpdateQuantity={handleUpdateQuantity}
                                    onRemove={handleRemoveItem}
                                />
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="mt-8 bg-white rounded-lg shadow p-4"
                    >
                        <h2 className="text-xl font-sans font-medium mb-4">Price Details</h2>
                        <div className="mb-4">
                            <span>Discounted Coupon</span>
                            <div className="flex justify-between items-center mt-2">
                                <input
                                    type="text"
                                    value={coupon}
                                    onChange={(e) => setCoupon(e.target.value)}
                                    className={`border rounded w-full p-2 mr-2 ${appliedCoupon ? 'bg-gray-200 cursor-not-allowed' : ''}`}
                                    placeholder="Enter coupon"
                                    disabled={Boolean(appliedCoupon)}
                                    aria-label="Enter coupon code"
                                />
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={handleApplyCoupon}
                                    className={`${appliedCoupon ? 'bg-red-500' : 'bg-[#3B5345]'} text-white px-4 py-2 rounded`}
                                    disabled={isApplyingCoupon}
                                    aria-label={appliedCoupon ? 'Remove applied coupon' : 'Apply coupon'}
                                >
                                    {isApplyingCoupon
                                        ? 'Applying...'
                                        : (appliedCoupon ? 'Remove' : 'Apply')}
                                </motion.button>
                            </div>
                            <AnimatePresence>
                                {couponMessage && (
                                    <motion.div
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className={`text-sm mt-2 ${appliedCoupon ? 'text-green-500' : 'text-red-500'}`}
                                    >
                                        {couponMessage}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Sub-total</span>
                            <span>{subTotal.toLocaleString()} IQD</span>
                        </div>
                        <div className="flex justify-between mb-2">
                            <span>Discount</span>
                            <span>{discount > 0 ? "-" : ""}{discount.toLocaleString()} IQD</span>
                        </div>
                        <div className="flex justify-between font-bold mt-4">
                            <span>Total Price</span>
                            <span>{totalPrice.toLocaleString()} IQD</span>
                        </div>
                    </motion.div>
                    {/* **Disable Proceed button if any item is out of stock** */}
                    <button
                        onClick={handleProceed}
                        disabled={isOrderSet || hasOutOfStock}
                        className={`w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg mt-6 block text-center ${isOrderSet || hasOutOfStock ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                        aria-label="Proceed to order"
                    >
                        {isOrderSet ? "Processing..." : "Proceed"}
                    </button>
                </motion.div>
            </>
    );
};

export default Cart;