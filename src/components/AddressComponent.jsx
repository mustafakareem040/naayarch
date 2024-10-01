'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from "next/navigation";
import { Trash2, Edit, CircleArrowLeft } from "lucide-react";

const AddressComponent = () => {
    const router = useRouter();
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const storedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
            setAddresses(storedAddresses);
        } catch (err) {
            console.error('Failed to load addresses from localStorage:', err);
            setError('Failed to load addresses.');
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Handle editing an address
    const handleEdit = (address) => {
        router.push(`/profile/address/edit/${address.id}`);
    };

    // Handle deleting an address
    const handleDelete = useCallback((id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            const updatedAddresses = addresses.filter(address => address.id !== id);
            setAddresses(updatedAddresses);
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        }
    }, [addresses]);

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Header */}
            <header className="flex items-center mb-8">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 cursor-pointer text-gray-700 hover:text-gray-900"
                    aria-label="Go back"
                />
                <h1 className="text-2xl ssm:text-3xl flex-1 text-center font-medium font-sans">Manage Addresses</h1>
                {/* Placeholder for alignment */}
                <div className="w-12"></div>
            </header>

            {/* Error Message */}
            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Add New Address Button */}
            <div className="w-full my-4 text-center">
                <button
                    className="py-4 px-14 flex items-center justify-center rounded-lg m-auto font-serif text-center text-white bg-[#3B5345] text-xl"
                    onClick={() => router.push("/profile/address/add")}
                    disabled={addresses.length >= 5}
                >
                    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-2">
                        <g clipPath="url(#clip0)">
                            <path d="M3.5 14C3.5 15.3789 3.77159 16.7443 4.29926 18.0182C4.82694 19.2921 5.60036 20.4496 6.57538 21.4246C7.55039 22.3996 8.70791 23.1731 9.98182 23.7007C11.2557 24.2284 12.6211 24.5 14 24.5C15.3789 24.5 16.7443 24.2284 18.0182 23.7007C19.2921 23.1731 20.4496 22.3996 21.4246 21.4246C22.3996 20.4496 23.1731 19.2921 23.7007 18.0182C24.2284 16.7443 24.5 15.3789 24.5 14C24.5 11.2152 23.3938 8.54451 21.4246 6.57538C19.4555 4.60625 16.7848 3.5 14 3.5C11.2152 3.5 8.54451 4.60625 6.57538 6.57538C4.60625 8.54451 3.5 11.2152 3.5 14Z" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M10.5 14H17.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                            <path d="M14 10.5V17.5" stroke="white" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
                        </g>
                        <defs>
                            <clipPath id="clip0">
                                <rect width="28" height="28" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    Add a New Address
                </button>
                {addresses.length >= 5 && <p className="text-red-500 mt-2">Maximum limit of 5 addresses reached</p>}
            </div>

            {/* Address List */}
            {isLoading ? (
                <p className="text-center">Loading addresses...</p>
            ) : (
                <div className="space-y-4 font-serif">
                    {addresses.length > 0 ? addresses.map((address) => (
                        <div
                            key={address.id}
                            className="flex justify-between text-base font-medium items-center text-black p-3.5 mb-4 w-full bg-[rgba(246,243,241,0.5)] rounded-lg"
                        >
                            <div className="space-y-1">
                                <h2 className="font-bold text-xl">{address.full_name}</h2>
                                <p className="">{`${address.governorate}, ${address.city}, ${address.address}`}</p>
                                <p className="">{address.phone_number}</p>
                            </div>
                            <div className="flex flex-col items-center space-y-2">
                                <button onClick={() => handleEdit(address)} aria-label="Edit Address">
                                    <Edit size={24} className="text-blue-500 hover:text-blue-700" />
                                </button>
                                <button onClick={() => handleDelete(address.id)} aria-label="Delete Address">
                                    <Trash2 size={24} className="text-red-500 hover:text-red-700" />
                                </button>
                            </div>
                        </div>
                    )) : (
                        <p className="text-center">No addresses found. Please add a new address.</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default AddressComponent;