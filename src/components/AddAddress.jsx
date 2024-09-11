'use client'
import React, { useState } from 'react';
import { HomeIcon, PlusCircleIcon } from 'lucide-react';
import Image from "next/image";
import {useRouter, useSearchParams} from "next/navigation";
import {addAddress} from "@/lib/features/addressesSlice";
import {useAppDispatch, useAppSelector} from "@/lib/hook";

export default function AddAddress() {
    const dispatch = useAppDispatch();
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
    const [addressType, setAddressType] = useState('');
    const [formData, setFormData] = useState({
        full_name: '',
        governorate: '',
        city: '',
        address: '',
        closest_point: '',
        phone_number: ''
    });
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        const newAddress = { ...formData, type: addressType };

        if (!isAuthenticated) {
            dispatch(addAddress(newAddress));
            handleRedirect();
            return;
        }

        try {
            const response = await fetch('https://api.naayiq.com/addresses', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newAddress),
                credentials: 'include'
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to add address');
            }

            dispatch(addAddress(newAddress));
            handleRedirect();
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleRedirect = () => {
        const redirectPath = searchParams.get('redirect');
        if (redirectPath) {
            router.push(redirectPath);
        } else {
            router.push('/profile/address');
        }
    };

    return (
        <div className="bg-white font-sans max-w-2xl mx-auto px-4">
            <header className="flex items-center justify-between mb-8">
                <button onClick={() => router.back()} className="p-2">
                    <Image src="/arrow-left.svg" width={40} height={40} alt="Go back" priority />
                </button>
                <h1 className="text-2xl font-bold">Add Address</h1>
                <div className="w-10"></div>
            </header>

            <div className="mb-6">
                <div className="flex font-medium space-x-2 mb-4">
                    {['home', 'work', 'other'].map((type) => (
                        <button
                            key={type}
                            className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                                addressType === type ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                            }`}
                            onClick={() => setAddressType(type)}
                        >
                            {type === 'home' && <HomeIcon className="mr-2 h-4 w-4" />}
                            {type === 'work' && <Image src="https://storage.naayiq.com/resources/work.svg" width={16} height={16} className="mr-2" alt="work" />}
                            {type === 'other' && <PlusCircleIcon className="mr-2 h-4 w-4" />}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <input
                        className="w-full p-3 border rounded-md"
                        placeholder="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                    />
                    <select
                        className="w-full p-3 border bg-white rounded-md appearance-none"
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        required
                    >
                        <option value="" disabled hidden>Governorate</option>
                        <option value="anbar">Al-Anbar</option>
                        <option value="babil">Babil</option>
                        <option value="baghdad">Baghdad</option>
                        <option value="basra">Basra</option>
                        <option value="dhi_qar">Dhi Qar</option>
                        <option value="diyala">Diyala</option>
                        <option value="dohuk">Dohuk</option>
                        <option value="erbil">Erbil</option>
                        <option value="karbala">Karbala</option>
                        <option value="kirkuk">Kirkuk</option>
                        <option value="maysan">Maysan</option>
                        <option value="muthanna">Muthanna</option>
                        <option value="najaf">Najaf</option>
                        <option value="nineveh">Nineveh</option>
                        <option value="qadisiyyah">Al-Qadisiyyah</option>
                        <option value="saladin">Saladin</option>
                        <option value="sulaymaniyah">Sulaymaniyah</option>
                        <option value="wasit">Wasit</option>
                    </select>
                    <input
                        className="w-full p-3 border rounded-md"
                        placeholder="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="w-full p-3 border rounded-md"
                        placeholder="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                    />
                    <input
                        className="w-full p-3 border rounded-md"
                        placeholder="The closest point of a function"
                        name="closest_point"
                        value={formData.closest_point}
                        onChange={handleInputChange}
                    />
                    <input
                        className="w-full p-3 border rounded-md"
                        placeholder="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                    />
                    {error && <p className="text-red-500">{error}</p>}
                    <button
                        type="submit"
                        className="w-full p-3 bg-[#3B5345] text-white rounded-md disabled:bg-gray-400"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    );
}