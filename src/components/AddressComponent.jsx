'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import { useCallback } from 'react';

const AddressItem = React.memo(({ address, onEdit, onDelete }) => (
    <div className="flex justify-between text-base font-medium items-center text-black p-3.5 mb-4 w-full bg-[rgba(246,243,241,0.5)] rounded-lg">
        <div className="space-y-1">
            <h2 className="font-bold text-xl">{address.full_name}</h2>
            <p>{`${address.governorate}, ${address.city}, ${address.address}`}</p>
            <p>{address.phone_number}</p>
        </div>
        <div className="flex flex-col items-end space-y-2">
            <button onClick={() => onEdit(address)} className="p-1">
                <Image src="/address/edit.svg" alt="Edit" width={24} height={24} />
            </button>
            <button onClick={() => onDelete(address.id)} className="p-1">
                <Image src="/address/delete.svg" alt="Delete" width={24} height={24} />
            </button>
        </div>
    </div>
));

AddressItem.displayName = 'AddressItem';

const NoAddresses = ({ onAddNew }) => (
    <div className="text-center py-10">
        <h2 className="text-2xl font-bold mb-4">You have no addresses yet</h2>
        <p className="mb-6">Let&apos;s add your first address to get started!</p>
        <button
            onClick={onAddNew}
            className="py-3 px-6 bg-[#3B5345] text-white rounded-lg font-medium hover:bg-[#2A3E32] transition-colors"
        >
            Add Your First Address
        </button>
    </div>
);

const ManageAddress = () => {
    const [addresses, setAddresses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const fetchAddresses = useCallback(async () => {
        try {
            setIsLoading(true);
            const response = await fetch('https://api.naayiq.com/addresses', { credentials: 'include' });
            if (response.status === 401 || response.status === 403) {
                router.push("/login");
                return;
            }
            if (!response.ok) {
                throw new Error('Failed to fetch addresses');
            }
            const data = await response.json();
            setAddresses(data);
            setError(null);
        } catch (err) {
            setError('Failed to fetch addresses. Please try again.');
            console.error('Error fetching addresses:', err);
        } finally {
            setIsLoading(false);
        }
    }, [router]);

    useEffect(() => {
        fetchAddresses();
    }, [fetchAddresses]);

    const handleEdit = useCallback((address) => {
        router.push(`/profile/address/edit/${address.id}`);
    }, [router]);

    const handleDelete = useCallback(async (id) => {
        const confirmed = await new Promise(resolve => {
            if (typeof window !== 'undefined') {
                resolve(window.confirm('Are you sure you want to delete this address?'));
            } else {
                resolve(false);
            }
        });

        if (confirmed) {
            try {
                const response = await fetch(`https://api.naayiq.com/addresses/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete address');
                }
                setAddresses(prev => prev.filter(address => address.id !== id));
            } catch (err) {
                setError('Failed to delete address. Please try again.');
                console.error('Error deleting address:', err);
            }
        }
    }, []);

    const handleAddNew = useCallback(() => {
        router.push("/profile/address/add");
    }, [router]);

    return (
        <div className="max-w-2xl mx-auto px-4">
            <header className="flex items-center justify-between mb-8">
                <button className="p-2" onClick={() => router.back()}>
                    <Image
                        src="https://storage.naayiq.com/resources/arrow-left.svg"
                        width={24}
                        height={24}
                        alt="Go back"
                        unoptimized={true}
                        priority
                    />
                </button>
                <h1 className="text-2xl font-medium">Manage Address</h1>
                <div className="w-10"></div>
            </header>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {!isLoading && addresses.length < 5 && (
                <div className="mb-8">
                    <button
                        className="w-full py-3 px-4 bg-[#3B5345] text-white rounded-lg font-medium hover:bg-[#2A3E32] transition-colors"
                        onClick={handleAddNew}
                    >
                        Add a new address
                    </button>
                </div>
            )}

            {isLoading ? (
                <p className="text-center py-8">Loading addresses...</p>
            ) : addresses.length === 0 ? (
                <NoAddresses onAddNew={handleAddNew} />
            ) : (
                <div className="space-y-4">
                    {addresses.map((address) => (
                        <AddressItem
                            key={address.id}
                            address={address}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                        />
                    ))}
                </div>
            )}

            {addresses.length >= 5 && (
                <p className="text-red-500 mt-4 text-center">Maximum limit of 5 addresses reached</p>
            )}
        </div>
    );
};

export default ManageAddress;