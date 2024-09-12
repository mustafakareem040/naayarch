'use client'
import React from 'react';
import { useRouter } from 'next/navigation';
import { useSelector, useDispatch } from 'react-redux';
import { setOrder } from '@/lib/features/orderSlice';
import Image from 'next/image';
import Link from "next/link";

const ChooseAddress = () => {
    const router = useRouter();
    const dispatch = useDispatch();
    const addresses = useSelector(state => state.addresses);
    const order = useSelector(state => state.order);
    const handleAddressSelect = (address) => {
        dispatch(setOrder({...order, shippingAddress: address }));
        router.push('/cart/order');
    };

    return (
        <div className="container mx-auto max-w-md font-serif">
            <header className="flex items-center mb-12">
                <button className="relative z-20" onClick={() => router.back()}>
                    <Image
                        src="https://storage.naayiq.com/resources/arrow-left.svg"
                        width={40}
                        height={40}
                        alt="back"
                    />
                </button>
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
                onClick={() => router.push('/profile/address/add')}
                href={{
                    pathname: "/profile/address/add",
                    query: {redirect: "/cart/choose-address"}
                }}>
                <p className="w-full text-center">Add a new address</p>
            </Link>
        </div>
    );
};

export default ChooseAddress;