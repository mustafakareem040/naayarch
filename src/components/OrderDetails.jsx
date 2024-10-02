// components/OrderDetails.jsx
'use client';

import Image from "next/image";
import React from "react";
import { CircleArrowLeft, Check, Copy } from "lucide-react";
import useFetchOrderDetails from "@/components/useFetchOrderDetails";
import {useParams, useRouter} from "next/navigation";

export default function OrderDetails() {
    const router = useRouter();
    const { orderId } = useParams(); // Assuming the route is /orders/[orderId]

    const { orderDetails, loading, error } = useFetchOrderDetails(orderId);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading order details...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (!orderDetails) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Order not found.</p>
            </div>
        );
    }

    return (
        <>
            <header className="flex items-center mb-6 relative">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 z-20 cursor-pointer"
                />
                <h1 className="text-3xl text-[#181717] absolute left-0 right-0 text-center font-medium">
                    Order Details
                </h1>
            </header>
            <div className="border-t border-[#695C5C]/30 border-solid w-full"></div>
            <div className="grid mt-12 mx-4 grid-cols-2 gap-4">
                <div className="mb-6">
                    <p className="font-sans font-medium text-base">Order ID</p>
                    <p className="font-serif text-[0.775rem]">#{orderDetails.id}</p>
                </div>
                <div className="justify-self-end mb-6">
                    <p className="font-sans font-medium text-base">Date</p>
                    <p className="font-serif text-[0.775rem]">
                        {new Date(orderDetails.created_at).toLocaleString()}
                    </p>
                </div>
                <div>
                    <p className="font-sans font-medium text-base">Status</p>
                    <p
                        className={`font-serif text-[0.775rem] ${
                            orderDetails.status === 'Complete'
                                ? 'text-green-500'
                                : orderDetails.status === 'Cancelled' || orderDetails.status === 'Rejected'
                                    ? 'text-red-500'
                                    : 'text-gray-500'
                        }`}
                    >
                        {orderDetails.status}
                    </p>
                </div>
            </div>
            <div className="border-t border-[#695C5C]/30 border-solid w-full mt-4"></div>
            <div className="mt-7 mb-6">
                <p className="font-sans font-medium text-xl">Track Orders</p>
                <OrderTracking steps={orderDetails.tracking_steps} />
            </div>
            <div className="border-t border-[#695C5C]/30 border-solid w-full"></div>
            <OrderedProducts products={orderDetails.products} />
            <div className="mt-8">
                <p className="font-sans font-medium mb-6 text-xl">Shipping Address</p>
                <div className="bg-skintone font-medium border border-[#695C5C]/30 space-y-5 border-solid font-serif p-4">
                    <p>{orderDetails.shippingAddress.city}</p>
                    <p>{orderDetails.shippingAddress.area}</p>
                    <p>{orderDetails.shippingAddress.details}</p>
                    <p>{orderDetails.shippingAddress.phone}</p>
                </div>
                {/* Remove Price Details and related sections */}
                {/* Optionally, handle actions based on order status */}
                {orderDetails.status !== 'Cancelled' && orderDetails.status !== 'Rejected' && (
                    <button className="bg-[#C91C1C] py-3 text-white font-sans text-xl font-bold w-full rounded-xl mt-6">
                        Cancel Order
                    </button>
                )}
            </div>
        </>
    );
}

const OrderTrackingStep = ({ label, date, isCompleted, isLast }) => (
    <div className="flex font-serif items-center">
        <div className="relative">
            <div
                className={`w-8 h-8 rounded-full border-2 ${
                    isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'bg-white border-gray-300'
                } flex items-center justify-center`}
            >
                {isCompleted && (
                    <svg
                        className="w-5 h-5 text-white"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                )}
            </div>
            {!isLast && (
                <div
                    className={`absolute top-8 left-1/2 w-0.5 h-full -translate-x-1/2 ${
                        isCompleted ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                ></div>
            )}
        </div>
        <div className="ml-4">
            <p className="font-semibold">{label}</p>
            <p className="text-sm text-gray-500">{date || 'Not Yet'}</p>
        </div>
    </div>
);

const OrderTracking = ({ steps }) => (
    <div className="space-y-6">
        {steps.map((step, index) => (
            <OrderTrackingStep
                key={step.label}
                label={step.label}
                date={step.date}
                isCompleted={step.isCompleted}
                isLast={index === steps.length - 1}
            />
        ))}
    </div>
);

const ProductItem = ({ image, name, details, quantity }) => (
    <div className="flex font-sans w-full items-start space-x-4 bg-white rounded-lg mb-4 p-4">
        <Image
            width={154}
            height={169}
            src={image}
            alt={name}
            className="object-cover rounded-lg"
        />
        <div className="flex-grow font-serif space-y-2">
            <h3 className="font-sans text-base">{name}</h3>
            {details.map((detail, index) => (
                <p key={index} className="text-sm text-[#695C5C]">
                    {detail}
                </p>
            ))}
            <div className="bg-gray-100 w-fit px-5 py-0.5 rounded-md">
                <span className="text-sm">Qty: {quantity}</span>
                <span className="ml-1">▼</span>
            </div>
        </div>
    </div>
);

const OrderedProducts = ({ products }) => (
    <>
        <h2 className="text-2xl mt-12 font-sans font-bold mb-8">Ordered Products</h2>
        {products.map((product, index) => (
            <ProductItem key={index} {...product} />
        ))}
    </>
);