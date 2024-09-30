'use client';
import React, { useState, useCallback } from 'react';
import { HomeIcon, PlusCircleIcon, BriefcaseBusiness, CircleArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from '@/components/NotificationContext'; // Assuming you have a notification system
import { addAddress } from "@/lib/features/addressesSlice";
import { useAppDispatch } from "@/lib/hook";

export default function AddAddress() {
    const [addressType, setAddressType] = useState(''); // Optional: Can be empty string
    const [formData, setFormData] = useState({
        full_name: '',
        governorate: '',
        city: '',
        address: '',
        closest_point: '',
        phone_number: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();
    const searchParams = useSearchParams();
    const { addNotification } = useNotification(); // Using notification context

    // Validate phone number
    const validatePhoneNumber = (number) => {
        const regex = /^07\d{9}$/; // Starts with '07' followed by 9 digits
        return regex.test(number);
    };

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validate phone number
        if (!validatePhoneNumber(formData.phone_number)) {
            setErrors(prev => ({
                ...prev,
                phone_number: 'Please enter a correct phone number 07xxxxxxxxx'
            }));
            setIsLoading(false);
            return;
        }

        const newAddress = { ...formData };
        if (addressType) {
            newAddress.type = addressType;
        }

        try {
            // Save to local storage with error handling
            const storedAddresses = JSON.parse(localStorage.getItem('addresses') || '[]');
            const updatedAddresses = [...storedAddresses, newAddress];
            localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
            localStorage.setItem('lastUsedAddress', JSON.stringify(newAddress));
            handleRedirect();
        } catch (error) {
            console.error('Failed to save the address:', error);
            setErrors(prev => ({
                ...prev,
                general: 'Failed to save the address. Please try again.'
            }));
            addNotification('error', 'Failed to save the address.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, addressType, dispatch, addNotification]);

    const handleRedirect = () => {
        const redirectPath = searchParams.get('redirect') ? "/cart/order" : "" || '/profile/address';
        router.push(redirectPath);
    };

    return (
        <div className="bg-white max-w-2xl mx-auto px-4">
            <header className="flex font-sans items-center justify-between mb-8">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 cursor-pointer"
                    aria-label="Go back"
                />
                <h1 className="text-2xl font-medium">Add Address</h1>
                <div className="w-10"></div>
            </header>

            <div className="mb-6 font-serif">
                <div className="font-medium flex space-x-2 mb-4">
                    {['home', 'work', 'other'].map((type) => (
                        <button
                            key={type}
                            className={`flex flex-1 items-center justify-center py-3 border rounded-md ${
                                addressType === type ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                            }`}
                            onClick={() => setAddressType(type)}
                            type="button"
                        >
                            {type === 'home' && <HomeIcon className="mr-2 h-4 w-4" />}
                            {type === 'work' && <BriefcaseBusiness className="mr-2 h-4 w-4" />}
                            {type === 'other' && <PlusCircleIcon className="mr-2 h-4 w-4" />}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                {errors.addressType && <p className="text-red-500 text-sm">{errors.addressType}</p>}

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
                        <option value="al-anbar">Al-Anbar</option>
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
                        <option value="al-qadisiyyah">Al-Qadisiyyah</option>
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
                        className={`w-full p-3 border rounded-md ${errors.phone_number ? 'border-red-500' : ''}`}
                        placeholder="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                        maxLength={11}
                        pattern="^07\d{9}$"
                        title="Please enter a correct phone number 07xxxxxxxxx."
                    />
                    {errors.phone_number && <p className="text-red-500 text-sm">{errors.phone_number}</p>}
                    {errors.general && <p className="text-red-500 text-sm">{errors.general}</p>}
                    <button
                        type="submit"
                        className="w-full p-3 bg-[#3B5345] text-white rounded-md disabled:bg-gray-400"
                        disabled={isLoading}
                        aria-label="Save Address"
                    >
                        {isLoading ? 'Saving...' : 'Save'}
                    </button>
                </form>
            </div>
        </div>
    )
}