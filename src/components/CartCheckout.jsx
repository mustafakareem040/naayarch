'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Plus, FileText } from 'lucide-react';
import Link from 'next/link';
import Image from "next/image";
import {useRouter} from "next/navigation";

const CartCheckout = ({ subTotal, delivery, discount, onBack }) => {
    const [note, setNote] = useState('');
    const router = useRouter()
    return (
        <>
            <header className="flex items-center mb-12">
                <button className="relative z-20" onClick={router.back}>
                    <Image unoptimized={true} src={"https://storage.naayiq.com/resources/arrow-left.svg"} width={40}
                           height={40} alt={"left"}/>
                </button>
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">Checkout</h1>
            </header>
            <div
                className="font-serif container mx-auto max-w-md"
            >

                <section
                    className="mb-6"
                >
                    <h2 className="text-xl font-sans font-medium mb-2">Shipping Address</h2>
                    <Link
                        href={{
                            pathname: "/profile/address/add",
                            query: {redirect: "/cart/order"}
                        }}
                        className="w-full border border-[#37474F] rounded-lg p-3 flex items-center justify-center text-[#3B5345] bg-[rgba(59,83,69,0.05)]">
                        <Plus className="w-6 h-6 mr-3"/>
                        <span className="text-base font-semibold">Add address</span>
                    </Link>
                </section>

                <section
                    className="mb-6"
                >
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

                <section
                    className="mb-6"
                >
                    <h2 className="text-xl font-sans font-medium mb-2">Payment Method</h2>
                    <div className="flex items-center">
                        <div
                            className="w-8 h-8 rounded-full border border-[#3B5345] flex items-center justify-center mr-3">
                            <div className="w-5 h-5 rounded-full bg-[#97C86C]"></div>
                        </div>
                        <span>Cash On Delivery</span>
                    </div>
                </section>

                <section
                    className="-mx-8 mb-6 bg-[#F6F3F1]/30 rounded-lg p-8"
                >
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
                            <span>{subTotal + delivery - discount} IQD</span>
                        </div>
                    </div>
                </section>

                <button
                    className="w-full bg-[#3B5345] text-white py-3 px-4 rounded-lg font-medium text-lg"
                >
                    Submit Order
                </button>
            </div>
        </>
    );
};

export default CartCheckout;