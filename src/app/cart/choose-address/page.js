'use client'
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";

const ChooseAddress = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [order, setOrder] = useState({});

    useEffect(() => {
        // Load addresses and order from local storage
        const storedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
        const storedOrder = JSON.parse(localStorage.getItem('orderData') || '{}');
        setAddresses(storedAddresses);
        setOrder(storedOrder);
    }, []);

    const handleAddressSelect = (address) => {
        const updatedOrder = { ...order, shippingAddress: address };
        setOrder(updatedOrder);
        // Save updated order to local storage
        localStorage.setItem('orderData', JSON.stringify(updatedOrder));
        router.push('/cart/order');
    };

    return (
        <div className="container mx-auto max-w-md font-serif">
            <header className="flex items-center mb-12">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20 cursor-pointer" />
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">
                    Choose Address
                </h1>
            </header>

            {addresses.map((address, index) => (
                <div
                    key={index}
                    className="mb-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    onClick={() => handleAddressSelect(address)}
                >
                    <h2 className="text-xl font-semibold mb-2">
                        {address.type === 'home' ? 'Home' : 'Work'}
                    </h2>
                    <p>{address.governorate}, {address.city}</p>
                    <p>{address.address}</p>
                    <p>{address.phone_number}</p>
                </div>
            ))}

            <Link
                className="w-full bg-[#3B5345] text-white py-3 px-4 rounded-lg inline-block font-medium text-lg mt-4"
                href={{
                    pathname: "/profile/address/add",
                    query: {redirect: "/cart/choose-address"}
                }}
            >
                <p className="w-full text-center">Add a new address</p>
            </Link>
        </div>
    );
};

export default ChooseAddress;