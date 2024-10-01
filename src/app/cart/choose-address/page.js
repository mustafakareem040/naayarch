'use client'
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import { CircleArrowLeft, Home, Building2, PlusCircle, MapPin, Phone, Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import {Button} from "@/components/ui/button";

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
    }, [router]);

    const handleAddressSelect = useCallback((address) => {
        setIsSelecting(true);
        try {
            const updatedOrder = { ...order, shippingAddress: address };
            setOrder(updatedOrder);
            localStorage.setItem('orderData', JSON.stringify(updatedOrder));
            localStorage.setItem('lastUsedAddress', JSON.stringify(address));
            router.push('/cart/order');
        } catch (err) {
            console.error('Failed to save order data:', err);
            setError('Failed to select address. Please try again.');
        } finally {
            setIsSelecting(false);
        }
    }, [order, router]);

    const handleDeleteAddress = useCallback((index) => {
        const updatedAddresses = addresses.filter((_, i) => i !== index);
        setAddresses(updatedAddresses);
        localStorage.setItem('addresses', JSON.stringify(updatedAddresses));
        if (updatedAddresses.length === 0) {
            router.push("/profile/address/add?redirect=cart/order");
        }
    }, [addresses, router]);

    const getAddressIcon = (type) => {
        switch (type) {
            case 'home':
                return <Home size={24} />;
            case 'work':
                return <Building2 size={24} />;
            default:
                return <PlusCircle size={24} />;
        }
    };

    const renderedAddresses = useMemo(() => {
        if (addresses.length === 0) {
            return;
        }

        return addresses.map((address, index) => (
            <div
                key={index}
                className="mb-4 p-4 bg-[#F6F3F1]/30 shadow-[0px_2px_4px_3px_rgba(0,0,0,0.1)] rounded-xl cursor-pointer hover:bg-gray-50"
                role="button"
                tabIndex={0}
                aria-label={`Select ${address.type ? address.type.charAt(0).toUpperCase() + address.type.slice(1) : 'Other'} address`}
            >
                <div className="flex items-center mb-2 justify-between">
                    <div className="flex items-center" onClick={() => handleAddressSelect(address)}>
                        {getAddressIcon(address.type)}
                        <h2 className="text-xl font-medium ml-2 capitalize">
                            {address.type
                                ? (address.type === 'home' ? 'Home' :
                                    address.type === 'work' ? 'Work' : 'Other')
                                : 'Other'}
                        </h2>
                    </div>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <button className="text-red-500 hover:text-red-700" aria-label="Delete address">
                                <Trash2 size={20} />
                            </button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90%] max-w-[364px] p-6 rounded-md shadow-lg">
                            <div className="flex flex-col items-center">
                                <div className="w-full  mb-6">
                                    <video autoPlay loop muted playsInline className="w-full max-h-[20vh]">
                                        <source src="/waiting.mp4" type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                </div>
                                <AlertDialogHeader className="font-serif text-center">
                                    <AlertDialogTitle className="text-2xl font-serif font-medium mb-2">Delete Address</AlertDialogTitle>
                                    <p className="text-gray-500 font-serif mb-6">
                                        Are you sure you want to delete this address?
                                    </p>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="w-full max-w-52 pt-4 font-serif flex flex-col">
                                    <AlertDialogAction
                                        className="w-full bg-[#44594A] py-6 text-white hover:bg-[#3a4d40] transition-colors duration-200"
                                        onClick={() => handleDeleteAddress(index)}
                                    >
                                        Delete
                                    </AlertDialogAction>
                                    <AlertDialogCancel
                                        className="w-full bg-gray-200 py-6 text-gray-700 hover:bg-gray-300 transition-colors duration-200"
                                        variant="secondary"
                                    >
                                        Cancel
                                    </AlertDialogCancel>
                                </AlertDialogFooter>
                            </div>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
                <div className="w-full mb-4 mt-4 h-[1px] bg-[#695C5C]/30"></div>
                <div className="flex items-center text-gray-800 mb-1" onClick={() => handleAddressSelect(address)}>
                    <MapPin size={18} className="mr-2"/>
                    <p className="capitalize">{address.governorate},&nbsp;</p>
                    <p>{`${address.city}, ${address.address}`}</p>
                </div>
                <div className="flex items-center text-gray-800" onClick={() => handleAddressSelect(address)}>
                    <Phone size={18} className="mr-2"/>
                    <p>{address.phone_number}</p>
                </div>
            </div>
        ));
    }, [addresses, handleAddressSelect, handleDeleteAddress]);

    return (
        <div className="container mx-auto max-w-md font-sans">
            <header className="flex items-center mb-12">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.push("/cart/order")}
                    className="p-2 relative z-20 cursor-pointer"
                    aria-label="Go back"
                />
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium">
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
                    query: { redirect: "/cart/order" }
                }}
                aria-label="Add a new address"
            >
                <PlusCircle size={24} />
                Add a new address
            </Link>
        </div>
    );
};

export default React.memo(ChooseAddress);