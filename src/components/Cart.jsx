'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Link from 'next/link';
import CartItem from './CartItem';
import { motion, AnimatePresence } from 'framer-motion';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppDispatch } from "@/lib/hook";
import { setOrder } from "@/lib/features/orderSlice";
import EmptyCart from "@/components/EmptyCart";
import {useSelector} from "react-redux";
import {CircleArrowLeft} from "lucide-react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [delivery] = useState(5000);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const dispatch = useAppDispatch();
    const order = useSelector(state => state.order);
    const router = useRouter();

    const fetchCartItems = useCallback(async () => {
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        if (storedCart.length === 0) {
            setIsLoading(false);
            return;
        }

        const itemsWithDetails = await Promise.all(
            storedCart.map(async (item) => {
                try {
                    const response = await fetch(`https://api.naayiq.com/products/${item.product_id}`);
                    const data = await response.json();
                    const product = data.product;
                    const selectedSize = product.sizes.find(size => size.id === item.size_id);
                    const selectedColor = product.colors.find(color => color.id === item.color_id);

                    return {
                        ...item,
                        title: product.name,
                        image: `https://storage.naayiq.com/resources/${selectedSize?.images[0]}`,
                        price: parseInt(selectedSize?.price || product.price),
                        color: selectedColor?.name,
                        size: selectedSize?.name,
                    };
                } catch (error) {
                    console.error('Error fetching product details:', error);
                    return item;
                }
            })
        );
        setCartItems(itemsWithDetails);
        setIsLoading(false);
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        setSubTotal(total);
    }, [cartItems]);

    const handleUpdateQuantity = useCallback((id, newQty) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === id ? { ...item, qty: newQty } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            return updatedItems;
        });
    }, []);

    const handleRemoveItem = useCallback((id) => {
        setShowConfirmation(true);
        setConfirmationMessage(`Are you sure you want to remove this item from your cart?`);
        setConfirmAction(() => () => {
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.product_id !== id);
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                return updatedItems;
            });
            setShowConfirmation(false);
        });
    }, []);

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
            setShowConfirmation(true);
            setConfirmationMessage(`Are you sure you want to remove the applied coupon?`);
            setConfirmAction(() => () => {
                setAppliedCoupon(null);
                setDiscount(0);
                setCoupon('');
                setCouponMessage('');
                setShowConfirmation(false);
            });
        } else {
            try {
                const response = await fetch(`https://api.naayiq.com/coupons/${encodeURIComponent(coupon)}/activate`, {
                    method: 'POST',
                });
                const data = await response.json();

                if (response.ok) {
                    const calculatedDiscount = calculateDiscount(data.coupon, subTotal);
                    setDiscount(calculatedDiscount);
                    setAppliedCoupon(data.coupon);
                    setCouponMessage('Coupon applied successfully!');
                } else {
                    setCouponMessage(data.message || "Invalid coupon code");
                }
            } catch (error) {
                console.error('Error applying coupon:', error);
                setCouponMessage("Error applying coupon. Please try again.");
            }
            setTimeout(() => setCouponMessage(''), 3000);
        }
    }, [appliedCoupon, coupon, subTotal, calculateDiscount]);

    useEffect(() => {
        if (appliedCoupon) {
            const newDiscount = calculateDiscount(appliedCoupon, subTotal);
            setDiscount(newDiscount);
        }
    }, [subTotal, appliedCoupon, calculateDiscount]);

    const totalPrice = useMemo(() => {
        const discountedTotal = subTotal - discount;
        return Math.max(discountedTotal, 0) + delivery;
    }, [subTotal, discount, delivery]);

    const [confirmAction, setConfirmAction] = useState(() => {});


    if (isLoading) {
        return <Loading />;
    }


    return (
        cartItems.length === 0 ? <EmptyCart />:
        <>
            <header className="flex items-center mb-6">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20" />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Cart
                </h1>
            </header>
            <motion.div
                initial={{opacity: 0}}
                animate={{opacity: 1}}
                exit={{opacity: 0}}
                className="p-4 overflow-x-hideen font-serif container mx-auto relative"
            >
                <AnimatePresence>
                    {showConfirmation && (
                        <motion.div
                            initial={{opacity: 0}}
                            animate={{opacity: 1}}
                            exit={{opacity: 0}}
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
                                        onClick={() => setShowConfirmation(false)}
                                        className="bg-gray-300 text-black px-4 py-2 rounded mr-2"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={confirmAction}
                                        className="bg-red-500 text-white px-4 py-2 rounded"
                                    >
                                        Confirm
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <AnimatePresence>
                    {cartItems.map(item => (
                        <motion.div
                            key={item.product_id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            <CartItem
                                id={item.product_id}
                                title={item.title}
                                color={item.color}
                                image={item.image}
                                size={item.size}
                                qty={item.qty}
                                price={item.price}
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
                    <div className="mb-2">
                        <span>Discounted Coupon</span>
                        <div className="flex justify-between items-center">
                            <input
                                type="text"
                                value={coupon}
                                onChange={(e) => setCoupon(e.target.value)}
                                className="border rounded w-full p-2 mr-2"
                                placeholder="Enter coupon"
                                disabled={appliedCoupon !== ''}
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleApplyCoupon}
                                className={`${appliedCoupon ? 'bg-red-500' : 'bg-[#3B5345]'} text-white px-8 py-2 rounded`}
                            >
                                {appliedCoupon ? 'Remove' : 'Apply'}
                            </motion.button>
                        </div>
                        <AnimatePresence>
                            {couponMessage && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className={`text-sm mt-1 ${couponMessage === 'Applied!' ? 'text-green-500' : 'text-red-500'}`}
                                >
                                    {couponMessage}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Sub-total</span>
                        <span>{subTotal} IQD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Delivery</span>
                        <span>{delivery} IQD</span>
                    </div>
                    <div className="flex justify-between mb-2">
                        <span>Discount</span>
                        <span>{discount > 0 ? "-" : ""}{discount} IQD</span>
                    </div>
                    <div className="flex justify-between font-bold mt-4">
                        <span>Total Price</span>
                        <span>{totalPrice} IQD</span>
                    </div>
                </motion.div>
                <Link
                    onClick={() => dispatch(setOrder({
                        ...order,
                        items: cartItems.map(item => ({
                            product_id: item.product_id,
                            size_id: item.size_id || null,
                            color_id: item.color_id || null,
                            quantity: item.qty,
                        })),
                        info: { delivery, discount, subTotal },
                    }))}
                    href="/cart/order"
                    className="w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg mt-6 block text-center"
                >
                    Proceed
                </Link>
            </motion.div>
        </>
    );
};

export default Cart;