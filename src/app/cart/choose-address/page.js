'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CircleArrowLeft } from "lucide-react";

const ChooseAddress = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [order, setOrder] = useState({});
    const [error, setError] = useState('');
    const [isSelecting, setIsSelecting] = useState(false);
    useEffect(() => {
        try {
            const storedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
            const storedOrder = JSON.parse(localStorage.getItem('orderData') || '{}');
            setAddresses(storedAddresses);
            setOrder(storedOrder);
            if (storedAddresses.length === 0) {
                router.push("/profile/address/add?redirect=cart/order")
            }
        } catch (err) {
            console.error('Failed to load from localStorage:', err);
            setError('Failed to load addresses. Please try again.');
        }
    }, []);

    const handleAddressSelect = useCallback((address) => {
        setIsSelecting(true);
        try {
            const updatedOrder = { ...order, shippingAddress: address };
            setOrder(updatedOrder);
            localStorage.setItem('orderData', JSON.stringify(updatedOrder));

            // Set lastUsedAddress
            localStorage.setItem('lastUsedAddress', JSON.stringify(address));
            router.push('/cart/order'); // Redirect to checkout
        } catch (err) {
            console.error('Failed to save order data:', err);
            setError('Failed to select address. Please try again.');
        } finally {
            setIsSelecting(false);
        }
    }, [order, router]);

    const renderedAddresses = useMemo(() => {
        if (addresses.length === 0) {
            return;
        }

        return addresses.map((address, index) => (
            <div
                key={index}
                className="mb-4 p-4 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                onClick={() => handleAddressSelect(address)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                        handleAddressSelect(address);
                    }
                }}
                aria-label={`Select ${address.type ? address.type.charAt(0).toUpperCase() + address.type.slice(1) : 'address'}`}
            >
                <h2 className="text-xl font-semibold mb-2 capitalize">
                    {address.type
                        ? (address.type === 'home' ? 'Home' :
                            address.type === 'work' ? 'Work' : 'Other')
                        : 'Other'}
                </h2>
                <p>{`${address.governorate}, ${address.city}`}</p>
                <p>{address.address}</p>
                <p>{address.phone_number}</p>
            </div>
        ));
    }, [addresses, handleAddressSelect]);

    return (
        <div className="container mx-auto max-w-md font-serif">
            <header className="flex items-center mb-12">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 relative z-20 cursor-pointer"
                    aria-label="Go back"
                />
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">
                    Choose Address
                </h1>
            </header>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}
            {isSelecting && <p className="text-center text-gray-500">Selecting address...</p>}
            {!isSelecting && renderedAddresses}

            <Link
                className="w-full flex items-center justify-center bg-[#3B5345] text-white py-3 px-4 rounded-lg gap-1.5 font-medium text-lg mt-4 text-center"
                href={{
                    pathname: "/profile/address/add",
                    query: { redirect: "/cart/order" } // Redirect back to checkout
                }}
                aria-label="Add a new address"
            >
                <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <g clipPath="url(#clip0_578_4240)">
                        <path
                            d="M3.5 14C3.5 15.3789 3.77159 16.7443 4.29926 18.0182C4.82694 19.2921 5.60036 20.4496 6.57538 21.4246C7.55039 22.3996 8.70791 23.1731 9.98182 23.7007C11.2557 24.2284 12.6211 24.5 14 24.5C15.3789 24.5 16.7443 24.2284 18.0182 23.7007C19.2921 23.1731 20.4496 22.3996 21.4246 21.4246C22.3996 20.4496 23.1731 19.2921 23.7007 18.0182C24.2284 16.7443 24.5 15.3789 24.5 14C24.5 11.2152 23.3938 8.54451 21.4246 6.57538C19.4555 4.60625 16.7848 3.5 14 3.5C11.2152 3.5 8.54451 4.60625 6.57538 6.57538C4.60625 8.54451 3.5 11.2152 3.5 14Z"
                            stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.5 14H17.5" stroke="white" strokeWidth="1.25" strokeLinecap="round"
                              strokeLinejoin="round"/>
                        <path d="M14 10.5V17.5" stroke="white" strokeWidth="1.25" strokeLinecap="round"
                              strokeLinejoin="round"/>
                    </g>
                    <defs>
                        <clipPath id="clip0_578_4240">
                            <rect width="28" height="28" fill="white"/>
                        </clipPath>
                    </defs>
                </svg>
                Add a new address
            </Link>
        </div>
    );
};

export default React.memo(ChooseAddress);