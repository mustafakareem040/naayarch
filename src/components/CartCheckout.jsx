'use client'

import React, { useState, useCallback, useMemo } from 'react';
import { CircleArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import {redirect, useRouter} from "next/navigation";
import { useSelector } from "react-redux";
import { useAppDispatch } from "@/lib/hook";
import { setOrder } from "@/lib/features/orderSlice";
import {useNotification} from "@/components/NotificationContext";
import "./NotificationStyles.css"
const CartCheckout = ({ subTotal, delivery, discount }) => {
    const [note, setNote] = useState('');
    const { shippingAddress, items } = useSelector(state => state.order);
    const router = useRouter();
    const dispatch = useAppDispatch();
    const {addNotification} = useNotification()
    const handleSubmitOrder = useCallback(async () => {
        const orderData = {
            notes: note,
            full_name: shippingAddress?.full_name,
            governorate: shippingAddress?.governorate,
            city: shippingAddress?.city,
            address: shippingAddress?.address,
            closest_point: shippingAddress?.closest_point,
            phone_number: shippingAddress?.phone_number,
            type: shippingAddress?.type,
            coupon_id: null,
            items: items.map(item => ({
                product_id: item.product_id,
                size_id: item.size_id || null,
                color_id: item.color_id || null,
                quantity: item.quantity,
            })),
        };

        try {
            const response = await fetch('https://api.naayiq.com/cart', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.removeItem('cart');
                dispatch(setOrder({ items: [], shippingAddress: null, note: '', info: {} }));
                redirect(`/cart/order/confirm?id=${data.cart.id}`);
            } else {
                const errorData = await response.json();
                if (errorData.errors && errorData.errors.length > 0) {
                    addNotification('error', errorData.errors[0].msg);
                } else {
                    addNotification('error', 'An error occurred while submitting the order');
                }
            }
        } catch (error) {
            console.error('Network error:', error);
            addNotification('error', 'A network error occurred. Please try again.');
        }
    }, [note, shippingAddress, items, dispatch, router]);

    const totalPrice = useMemo(() => subTotal + delivery - discount, [subTotal, delivery, discount]);

    const renderShippingAddress = () => (
        shippingAddress ? (
            <>
                <div className="border border-gray-200 rounded-lg p-4">
                    <p>{shippingAddress.governorate}, {shippingAddress.city}</p>
                    <p>{shippingAddress.address}</p>
                    <p>{shippingAddress.phone_number}</p>
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

    return (
        <>
            <header className="flex items-center mb-12">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20" />
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
                        <FileText className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"/>
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
                >
                    Submit Order
                </button>
            </div>
        </>
    );
};

export default React.memo(CartCheckout);