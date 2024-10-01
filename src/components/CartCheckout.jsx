'use client';

import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { CircleArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import './NotificationStyles.css';

const CartCheckout = ({ subTotal, discount }) => {
    const [note, setNote] = useState('');
    const [orderData, setOrderData] = useState({
        shippingAddress: null,
        coupon_id: null,
        items: [],
    });
    const [userInfo, setUserInfo] = useState({ userId: null });
    const router = useRouter();
    const { addNotification } = useNotification();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [userId, setUserId] = useState(null)
    // Load orderData and userInfo on mount
    useEffect(() => {
        if (typeof window !== 'undefined') {
            try {
                const storedOrder = JSON.parse(localStorage.getItem('orderData') || 'null');
                const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
                // Check for lastUsedAddress
                const lastUsedAddress = JSON.parse(localStorage.getItem('lastUsedAddress') || 'null');

                if (lastUsedAddress) {
                    setOrderData({...storedOrder,
                        shippingAddress: lastUsedAddress,
                    });
                }
                if (typeof window !== 'undefined') {
                    const userId_temp = localStorage.getItem("userId")
                    if (userId_temp) {
                        try {
                            console.log(userId_temp)
                            setUserId(parseInt(userId_temp))
                        }
                        catch (error) {

                        }
                    }
                }

                setUserInfo(storedUserInfo || { userId: null });
            } catch (err) {
                console.error('Failed to load order data:', err);
                addNotification('error', 'Failed to load order data.');
            }
            router.prefetch("/cart/order/confirm");
        }
    }, [addNotification, router]);

    const delivery = useMemo(() => {
        if (subTotal > 100000) {
            return 0; // Free delivery for orders over 100,000 IQD
        }
        if (orderData.shippingAddress?.governorate) {
            return orderData.shippingAddress.governorate.toLowerCase() === 'karbala' ? 0 : 5000;
        }
        return 5000; // Default delivery fee if governorate not specified
    }, [subTotal, orderData.shippingAddress]);

    const totalPrice = useMemo(() => subTotal + delivery - discount, [subTotal, delivery, discount]);

    const renderShippingAddress = useCallback(() => {
        if (orderData.shippingAddress) {
            const { governorate, city, address, phone_number } = orderData.shippingAddress;
            return (
                <>
                    <div className="border border-gray-200 rounded-lg p-4">
                        <p>{`${governorate}, ${city}`}</p>
                        <p>{address}</p>
                        <p>{phone_number}</p>
                    </div>
                    <Link
                        href="/cart/choose-address"
                        className="w-full border mt-2 border-[#37474F] rounded-lg p-3 flex items-center justify-center text-[#3B5345] bg-[rgba(59,83,69,0.05)]"
                        aria-label="Choose another address"
                    >
                        <span className="text-base font-semibold">Choose another address</span>
                    </Link>
                </>
            );
        } else {
            return (
                <Link
                    href="/cart/choose-address"
                    prefetch={false}
                    className="w-full border border-[#37474F] rounded-lg p-3 flex items-center justify-center text-[#3B5345] bg-[rgba(59,83,69,0.05)]"
                    aria-label="Choose address"
                >
                    <span className="text-base font-semibold">Choose address</span>
                </Link>
            );
        }
    }, [orderData.shippingAddress]);

    const handleSubmitOrder = useCallback(async () => {
        if (!orderData.shippingAddress) {
            addNotification('error', 'Please provide a shipping address.');
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            user_id: userId,
            notes: note,
            full_name: orderData.shippingAddress.full_name || '',
            governorate: orderData.shippingAddress.governorate || '',
            city: orderData.shippingAddress.city || '',
            address: orderData.shippingAddress.address || '',
            closest_point: orderData.shippingAddress.closest_point || '', // Optional
            phone_number: orderData.shippingAddress.phone_number || '',
            type: orderData.shippingAddress.type || '', // Optional
            coupon_id: orderData.coupon_id || null,
            items: orderData.items.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id || null,
                color_id: item.color_id || null,
                quantity: item.quantity,
            })),
        };
        console.log(submitData)
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/cart`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(submitData),
            });

            if (response.ok) {
                const data = await response.json();
                router.push(`/cart/order/confirm?id=${data.cart.id}`);
            } else {
                const errorData = await response.json();
                setIsSubmitting(false);
                if (errorData.errors && errorData.errors.length > 0) {
                    addNotification('error', errorData.errors[0].msg || 'An error occurred while submitting the order.');
                } else {
                    addNotification('error', 'An error occurred while submitting the order.');
                }
            }
        } catch (err) {
            console.error('Order submission failed:', err);
            addNotification('error', 'A network error occurred. Please try again.');
            setIsSubmitting(false);
        }
    }, [note, orderData, userId, addNotification, router]);

    return (
        <>
            <header className="flex items-center mb-12">
                <button
                    onClick={() => router.push("/cart")}
                    className="p-2 relative z-20 cursor-pointer"
                    aria-label="Go back"
                >
                    <CircleArrowLeft size={52} strokeWidth={0.7} />
                </button>
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">
                    Checkout
                </h1>
            </header>
            <div className="font-serif overflow-x-hidden container mx-auto max-w-md">
                <section className="mb-6">
                    <h2 className="text-xl font-sans font-medium mb-2">Shipping Address</h2>
                    {renderShippingAddress()}
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-sans font-medium mb-2">Note</h2>
                    <p className="text-sm text-gray-600 mb-2">Write Any Additional Note</p>
                    <div className="relative">
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            placeholder="I am not available on Sunday"
                            className="w-full border border-[rgba(105,92,92,0.3)] rounded-lg p-4 pl-12 text-sm"
                            aria-label="Additional note"
                        />
                    </div>
                </section>

                <section className="mb-6">
                    <h2 className="text-xl font-sans font-medium mb-2">Payment Method</h2>
                    <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full border border-[#3B5345] flex items-center justify-center mr-3">
                            <div className="w-5 h-5 rounded-full bg-[#97C86C]"></div>
                        </div>
                        <span>Cash On Delivery</span>
                    </div>
                </section>

                <section className="-mx-8 mb-6 bg-[#F6F3F1]/30 rounded-lg p-8">
                    <h2 className="text-xl font-sans font-medium mb-4">Price Details</h2>
                    <div className="h-[1px] w-full mb-6 bg-[#695C5C]/30"></div>
                    <div className="space-y-3">
                        <div className="flex justify-between">
                            <span>Sub-total</span>
                            <span>{subTotal.toLocaleString()} IQD</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{delivery.toLocaleString()} IQD</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>{discount && discount > 0 ? "-" : ""}{discount?.toLocaleString()} IQD</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total Price</span>
                            <span>{totalPrice.toLocaleString()} IQD</span>
                        </div>
                    </div>
                </section>
                <button
                    onClick={handleSubmitOrder}
                    className="w-full inline-block bg-[#3B5345] text-white py-3 px-4 rounded-lg font-medium text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSubmitting}
                    aria-label="Submit Order"
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
                {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </div>
        </>
    );

};

export default React.memo(CartCheckout);