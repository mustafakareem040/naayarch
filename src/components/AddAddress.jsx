'use client';

import React, { useState, useCallback, useRef } from 'react';
import { HomeIcon, PlusCircleIcon, BriefcaseBusiness, CircleArrowLeft } from 'lucide-react';
import { useRouter, useSearchParams } from "next/navigation";
import { useNotification } from '@/components/NotificationContext'; // Assuming you have a notification system

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
    const formRef = useRef(null);

    // Validate phone number with optional starting '0'
    const validatePhoneNumber = useCallback((number) => {
        const regex = /^0?7\d{9}$/; // Starts with '07' or '7' followed by 9 digits
        return regex.test(number);
    }, []);

    // Handle input change
    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    }, []);

    // Define handleRedirect with useCallback
    const handleRedirect = useCallback(() => {
        const redirectPath = searchParams.get('redirect') ? "/cart/order" : '/profile/address';
        router.push(redirectPath);
    }, [router, searchParams]);

    // Handle form submission
    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrors({});

        // Validate phone number
        if (!validatePhoneNumber(formData.phone_number)) {
            setErrors(prev => ({
                ...prev,
                phone_number: 'Please enter a correct phone number starting with 07xxxxxxxxx or 7xxxxxxxxx.'
            }));
            setIsLoading(false);
            return;
        }

        const newAddress = { ...formData };
        if (addressType) {
            newAddress.type = addressType;
        }

        try {
            // Retrieve existing addresses safely
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
            addNotification('error', `Failed to save the address. ${error}`);
        } finally {
            setIsLoading(false);
        }
    }, [formData, addressType, validatePhoneNumber, addNotification, handleRedirect]);

    return (
        <div className="bg-white max-w-2xl mx-auto px-4 py-8">
            {/* Header */}
            <header className="flex font-sans items-center justify-between mb-8">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={1}
                    onClick={() => router.back()}
                    className="p-2 cursor-pointer text-gray-700 hover:text-gray-900"
                    aria-label="Go back"
                />
                <h1 className="text-3xl font-medium">Add Address</h1>
                {/* Placeholder for alignment */}
                <div className="w-8"></div>
            </header>

            {/* Notification Placeholder */}
            {/* Ensure your NotificationContext displays notifications appropriately */}

            {/* Address Type Selection */}
            <div className="mb-6 font-serif">
                <div className="font-medium font-sans flex space-x-2 mb-4">
                    {['home', 'work', 'other'].map((type) => (
                        <button
                            key={type}
                            className={`flex flex-1 items-center justify-center py-3 border rounded-md transition-colors duration-200 ${
                                addressType === type
                                    ? 'bg-[#3B5345] text-white'
                                    : 'bg-white text-gray-800 hover:bg-gray-100'
                            }`}
                            onClick={() => setAddressType(type)}
                            type="button"
                            aria-pressed={addressType === type}
                        >
                            {type === 'home' && <HomeIcon className="mr-2 h-4 w-4" />}
                            {type === 'work' && <BriefcaseBusiness className="mr-2 h-4 w-4" />}
                            {type === 'other' && <PlusCircleIcon className="mr-2 h-4 w-4" />}
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                        </button>
                    ))}
                </div>
                {errors.addressType && <p className="text-red-500 text-sm">{errors.addressType}</p>}
            </div>

            {/* Address Form */}
            <form onSubmit={handleSubmit} className="space-y-4 font-medium font-serif" ref={formRef}>
                {/* Full Name */}
                <div>
                    <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">
                        Full Name
                    </label>
                    <input
                        id="full_name"
                        className={`mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.full_name ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Full Name"
                        name="full_name"
                        value={formData.full_name}
                        onChange={handleInputChange}
                        required
                        aria-invalid={errors.full_name ? 'true' : 'false'}
                        aria-describedby={errors.full_name ? 'full_name-error' : undefined}
                    />
                    {errors.full_name && (
                        <p className="text-red-500 text-sm mt-1" id="full_name-error">
                            {errors.full_name}
                        </p>
                    )}
                </div>

                {/* Governorate */}
                <div>
                    <label htmlFor="governorate" className="block text-sm font-medium text-gray-700">
                        Governorate
                    </label>
                    <select
                        id="governorate"
                        className={`mt-1 w-full p-3 border rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.governorate ? 'border-red-500' : 'border-gray-300'
                        }`}
                        name="governorate"
                        value={formData.governorate}
                        onChange={handleInputChange}
                        required
                        aria-invalid={errors.governorate ? 'true' : 'false'}
                        aria-describedby={errors.governorate ? 'governorate-error' : undefined}
                    >
                        <option value="" disabled hidden>Governorate</option>
                        {/* Add all governorate options here */}
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
                    {errors.governorate && (
                        <p className="text-red-500 text-sm mt-1" id="governorate-error">
                            {errors.governorate}
                        </p>
                    )}
                </div>

                {/* City */}
                <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City
                    </label>
                    <input
                        id="city"
                        className={`mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="City"
                        name="city"
                        value={formData.city}
                        onChange={handleInputChange}
                        required
                        aria-invalid={errors.city ? 'true' : 'false'}
                        aria-describedby={errors.city ? 'city-error' : undefined}
                    />
                    {errors.city && (
                        <p className="text-red-500 text-sm mt-1" id="city-error">
                            {errors.city}
                        </p>
                    )}
                </div>

                {/* Address */}
                <div>
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address
                    </label>
                    <input
                        id="address"
                        className={`mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.address ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                        required
                        aria-invalid={errors.address ? 'true' : 'false'}
                        aria-describedby={errors.address ? 'address-error' : undefined}
                    />
                    {errors.address && (
                        <p className="text-red-500 text-sm mt-1" id="address-error">
                            {errors.address}
                        </p>
                    )}
                </div>

                {/* Closest Point */}
                <div>
                    <label htmlFor="closest_point" className="block text-sm font-medium text-gray-700">
                        The Closest Point of Function
                    </label>
                    <input
                        id="closest_point"
                        className={`mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.closest_point ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="The closest point of a function"
                        name="closest_point"
                        value={formData.closest_point}
                        onChange={handleInputChange}
                        aria-invalid={errors.closest_point ? 'true' : 'false'}
                        aria-describedby={errors.closest_point ? 'closest_point-error' : undefined}
                    />
                    {errors.closest_point && (
                        <p className="text-red-500 text-sm mt-1" id="closest_point-error">
                            {errors.closest_point}
                        </p>
                    )}
                </div>

                {/* Phone Number */}
                <div>
                    <label htmlFor="phone_number" className="block text-sm font-medium text-gray-700">
                        Phone Number
                    </label>
                    <input
                        id="phone_number"
                        className={`mt-1 w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#3B5345] ${
                            errors.phone_number ? 'border-red-500' : 'border-gray-300'
                        }`}
                        placeholder="Phone Number"
                        name="phone_number"
                        value={formData.phone_number}
                        onChange={handleInputChange}
                        required
                        type={"tel"}
                        maxLength={11}
                        pattern="^0?7\d{9}$"
                        title="07xxxxxxxxx or 7xxxxxxxxx."
                        aria-invalid={errors.phone_number ? 'true' : 'false'}
                        aria-describedby={errors.phone_number ? 'phone_number-error' : undefined}
                    />
                    {errors.phone_number && (
                        <p className="text-red-500 text-sm mt-1" id="phone_number-error">
                            {errors.phone_number}
                        </p>
                    )}
                </div>

                {/* General Errors */}
                {errors.general && (
                    <div className="text-red-500 text-sm">
                        {errors.general}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    className={`w-full p-3 bg-[#3B5345] text-white rounded-md hover:bg-[#2a4031] transition-colors duration-200 disabled:bg-gray-400`}
                    disabled={isLoading}
                    aria-label="Save Address"
                >
                    {isLoading ? 'Saving...' : 'Save'}
                </button>
            </form>
        </div>
    );
}