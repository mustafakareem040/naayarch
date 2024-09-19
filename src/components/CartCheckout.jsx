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

    useEffect(() => {
        const storedOrder = JSON.parse(localStorage.getItem('order') || '{}');
        const storedUserInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');
        setOrderData(storedOrder);
        setUserInfo(storedUserInfo);
        router.prefetch("/cart/order/confirm");
    }, []);

    const delivery = useMemo(() => {
        if (subTotal > 100000) {
            return 0; // Free delivery for orders over 100,000 IQD
        }
        return orderData.shippingAddress?.governorate.toLowerCase() === 'karbala' ? 0 : 5000;
    }, [subTotal, orderData.shippingAddress]);

    const totalPrice = useMemo(() => subTotal + delivery - discount, [subTotal, delivery, discount]);

    const renderShippingAddress = () => (
        orderData.shippingAddress ? (
            <>
                <div className="border border-gray-200 rounded-lg p-4">
                    <p>{orderData.shippingAddress.governorate}, {orderData.shippingAddress.city}</p>
                    <p>{orderData.shippingAddress.address}</p>
                    <p>{orderData.shippingAddress.phone_number}</p>
                </div>
                <Link
                    href="/cart/choose-address"
                    className="w-full border mt-2 border-[#37474F] rounded-lg p-3 flex items-center justify-center text-[#3B5345] bg-[rgba(59,83,69,0.05)]"
                >
                    <span className="text-base font-semibold">Choose another address</span>
                </Link>
            </>
        ) : (
            <Link
                href="/cart/choose-address"
                prefetch={false}
                className="w-full border border-[#37474F] rounded-lg p-3 flex items-center justify-center text-[#3B5345] bg-[rgba(59,83,69,0.05)]"
            >
                <span className="text-base font-semibold">Choose address</span>
            </Link>
        )
    );

    const handleSubmitOrder = useCallback(async () => {
        if (isSubmitting) return; // Prevent multiple submissions

        if (!orderData.shippingAddress) {
            addNotification('error', 'Please provide a shipping address.');
            return;
        }

        setIsSubmitting(true);

        const submitData = {
            user_id: userInfo.userId || null,
            notes: note,
            full_name: orderData.shippingAddress?.full_name,
            governorate: orderData.shippingAddress?.governorate,
            city: orderData.shippingAddress?.city,
            address: orderData.shippingAddress?.address,
            closest_point: orderData.shippingAddress?.closest_point,
            phone_number: orderData.shippingAddress?.phone_number,
            type: orderData.shippingAddress?.type,
            coupon_id: orderData.coupon_id,
            items: orderData.items.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id || null,
                color_id: item.color_id || null,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch('https://api.naayiq.com/cart', {
                method: 'POST',
                credentials: 'include',
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
                if (errorData.errors) {
                    addNotification('error', errorData.errors[0].msg);
                } else {
                    addNotification('error', 'An error occurred while submitting the order.');
                }
            }
        } catch (error) {
            console.error('Network error:', error);
            addNotification('error', 'A network error occurred. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }, [note, orderData, userInfo, addNotification, router, isSubmitting]);    return (
        <>
            <header className="flex items-center mb-12">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={() => router.back()} className="p-2 relative z-20 cursor-pointer" />
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">Checkout</h1>
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
                            <span>{subTotal} IQD</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Delivery</span>
                            <span>{delivery} IQD</span>
                        </div>
                        <div className="flex justify-between">
                            <span>Discount</span>
                            <span>{discount} IQD</span>
                        </div>
                        <div className="flex justify-between font-bold">
                            <span>Total Price</span>
                            <span>{totalPrice} IQD</span>
                        </div>
                    </div>
                </section>
                <button
                    onClick={handleSubmitOrder}
                    className="w-full inline-block bg-[#3B5345] text-white py-3 px-4 rounded-lg font-medium text-lg"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Submitting...' : 'Submit Order'}
                </button>
            </div>
        </>
    );
};

export default React.memo(CartCheckout);