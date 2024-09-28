'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from "next/navigation";
import {useAppDispatch, useAppSelector} from "@/lib/hook";
import {removeAddress, setAddresses} from "@/lib/features/addressesSlice";
import {CircleArrowLeft} from "lucide-react";

const AddressItem = ({ address, onEdit, onDelete }) => {
    return (
        <div className="flex justify-between text-base font-medium items-center text-black p-3.5 mb-4 w-full bg-[rgba(246,243,241,0.5)] rounded-lg">
            <div className="space-y-1">
                <h2 className="font-bold text-xl">{address.full_name}</h2>
                <p className="">{`${address.governorate}, ${address.city}, ${address.address}`}</p>
                <p className="">{address.phone_number}</p>
            </div>
            <div className="flex flex-col items-baseline space-x-2">
                <button onClick={() => onEdit(address)}>
                    <Image src="/address/edit.svg" alt="Edit" width={28} height={28} />
                </button>
                <button onClick={() => onDelete(address.id)}>
                    <Image src="/address/delete.svg" alt="Delete" width={28} height={28} />
                </button>
            </div>
        </div>
    );
};

const ManageAddress = () => {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const addresses = useAppSelector(state => state.addresses);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const fetchAddresses = async () => {
            try {
                if (isAuthenticated) {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/addresses`, {credentials: 'include'});
                    if (response.status === 401 || response.status === 403) {
                        router.push("/login");
                    }
                    if (!response.ok) {
                        throw new Error('Failed to fetch addresses');
                    }
                    const data = await response.json();
                    dispatch(setAddresses(data));
                }
            } catch (err) {
                console.error('Error fetching addresses:', err);
            }
        };
        fetchAddresses();
        setIsLoading(false)
    }, [dispatch, router]);

    const handleEdit = (address) => {
        router.push(`/profile/address/edit/${address.id}`);
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this address?')) {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/addresses/${id}`, {
                    method: 'DELETE',
                    credentials: 'include'
                });
                if (!response.ok) {
                    throw new Error('Failed to delete address');
                }
                dispatch(removeAddress(id));
            } catch (err) {
                console.error('Error deleting address:', err);
            }
        }
    };

    return (
        <div>
            <header className="flex items-center mb-24">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20" />
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">Manage Address</h1>
            </header>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            <div className="w-full my-20 text-center">
                <button
                    className="py-4 px-14 rounded-lg m-auto font-serif text-center text-white bg-[#3B5345] text-xl"
                    onClick={() => router.push("/profile/address/add")}
                    disabled={addresses.length >= 5}
                >
                    Add a new address
                </button>
                {addresses.length >= 5 && <p className="text-red-500 mt-2">Maximum limit of 5 addresses reached</p>}
            </div>

            {isLoading ? (
                <p className="text-center">Loading addresses...</p>
            ) : (
                <div className="space-y-4 font-serif">
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
        </div>
    );
};

export default ManageAddress;