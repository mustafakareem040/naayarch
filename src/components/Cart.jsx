'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import CartItem from './CartItem';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import { setOrder } from "@/lib/features/orderSlice";
import EmptyCart from "@/components/EmptyCart";
import { CircleArrowLeft } from "lucide-react";

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [delivery] = useState(5000);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [appliedCouponId, setAppliedCouponId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');
    const [couponMessage, setCouponMessage] = useState('');
    const [appliedCoupon, setAppliedCoupon] = useState('');
    const [isOrderSet, setIsOrderSet] = useState(false);
    const dispatch = useAppDispatch();
    const order = useAppSelector(state => state.order);
    const router = useRouter();
    const [isNavigating, setIsNavigating] = useState(false)
    const fetchCartItems = useCallback(async () => {
        console.log('Fetching cart items...');
        const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
        console.log('Stored cart:', storedCart);
        if (storedCart.length === 0) {
            console.log('Cart is empty.');
            setIsLoading(false);
            return;
        }

        try {
            const itemsWithDetails = await Promise.all(
                storedCart.map(async (item) => {
                    try {
                        const response = await fetch(`https://api.naayiq.com/products/${item.product_id}`);
                        console.log(`Fetching product ${item.product_id}:`, response.status);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch product ${item.product_id}: ${response.statusText}`);
                        }
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
                        console.error(`Error fetching product ${item.product_id}:`, error);
                        return item; // Return the original item if fetching fails
                    }
                })
            );
            console.log('Fetched cart items with details:', itemsWithDetails);
            setCartItems(itemsWithDetails);
        } catch (error) {
            console.error('Error in fetchCartItems:', error);
        } finally {
            console.log('Setting isLoading to false.');
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCartItems();
    }, [fetchCartItems]);
    useEffect(() => {
        router.prefetch("/cart/order")
    })

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * (item.qty || 1), 0);
        console.log('Calculating subTotal:', total);
        setSubTotal(total);
    }, [cartItems]);

    const handleUpdateQuantity = useCallback((id, newQty) => {
        setCartItems(prevItems => {
            const updatedItems = prevItems.map(item =>
                item.product_id === id ? { ...item, qty: newQty } : item
            );
            localStorage.setItem('cart', JSON.stringify(updatedItems));
            console.log(`Updated quantity for product ${id} to ${newQty}`);
            return updatedItems;
        });
    }, []);

    const handleRemoveItem = useCallback((id) => {
        setShowConfirmation(true);
        setConfirmationMessage('Are you sure you want to remove this item from your cart?');
        setConfirmAction(() => () => {
            setCartItems(prevItems => {
                const updatedItems = prevItems.filter(item => item.product_id !== id);
                localStorage.setItem('cart', JSON.stringify(updatedItems));
                console.log(`Removed product ${id} from cart.`);
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
            setConfirmationMessage('Are you sure you want to remove the applied coupon?');
            setConfirmAction(() => () => {
                setAppliedCoupon(null);
                setAppliedCouponId(null);
                setDiscount(0);
                setCoupon('');
                setCouponMessage('');
                setShowConfirmation(false);
                console.log('Removed applied coupon.');
            });
        } else {
            console.log(`Applying coupon: ${coupon}`);
            try {
                const response = await fetch(`https://api.naayiq.com/coupons/${encodeURIComponent(coupon)}/activate`, {
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
                    setAppliedCoupon(data.coupon);
                    setAppliedCouponId(data.coupon.id);
                    setCouponMessage(data.message || 'Coupon applied successfully!');
                    console.log(`Coupon applied: ${data.coupon.id} with discount ${calculatedDiscount}`);
                } else {
                    setCouponMessage(data.message || "Invalid coupon code");
                    console.warn('Error applying coupon:', data.message);
                }
            } catch (error) {
                console.error('Error applying coupon:', error);
                setCouponMessage("Error applying coupon. Please try again.");
            }
        }
    }, [appliedCoupon, coupon, subTotal, calculateDiscount]);

    useEffect(() => {
        if (appliedCoupon) {
            const newDiscount = calculateDiscount(appliedCoupon, subTotal);
            setDiscount(newDiscount);
            console.log(`Recalculated discount based on applied coupon: ${newDiscount}`);
        }
    }, [subTotal, appliedCoupon, calculateDiscount]);

    const totalPrice = useMemo(() => {
        const discountedTotal = subTotal - discount;
        return Math.max(discountedTotal, 0);
    }, [subTotal, discount]);

    const [confirmAction, setConfirmAction] = useState(() => {});

    const handleProceed = useCallback(() => {
        // Prepare the order data
        const orderData = {
            ...order,
            coupon_id: appliedCouponId,
            items: cartItems.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id || null,
                color_id: item.color_id || null,
                quantity: item.qty || 1,
            })),
            info: { delivery, discount, subTotal },
        };
        console.log('Dispatching setOrder with data:', orderData);

        dispatch(setOrder(orderData));

        setIsOrderSet(true);
    }, [order, appliedCouponId, cartItems, delivery, discount, subTotal, dispatch]);

    // Listen for the flag and navigate when it's set
    useEffect(() => {
        if (isOrderSet) {
            console.log('Order has been set. Navigating to /cart/order');
            router.push('/cart/order');
            setIsNavigating(true)
            setIsOrderSet(false);
        }
    }, [isOrderSet, router]);

    if (isLoading) {
        console.log('Loading is true. Rendering <Loading /> component.');
        return <Loading />;
    }

    return (
        cartItems.length === 0 ? <EmptyCart /> :
            <>
                <header className="flex items-center mb-6">
                    <CircleArrowLeft size={52} strokeWidth={0.7} onClick={() => router.back()} className="p-2 relative z-20 cursor-pointer" />
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
                                    disabled={Boolean(appliedCoupon)}
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
                                        className={`text-sm mt-1 ${appliedCoupon ? 'text-green-500' : 'text-red-500'}`}
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
                            <span>Discount</span>
                            <span>{discount > 0 ? "-" : ""}{discount} IQD</span>
                        </div>
                        <div className="flex justify-between font-bold mt-4">
                            <span>Total Price</span>
                            <span>{totalPrice} IQD</span>
                        </div>
                    </motion.div>
                    <button
                        onClick={handleProceed}
                        disabled={isOrderSet || isNavigating}
                        className="w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg mt-6 block text-center"
                    >
                        {isOrderSet || isNavigating ? "Processing..." : "Proceed"}
                    </button>
                </motion.div>
            </>
    );
};

export default Cart;