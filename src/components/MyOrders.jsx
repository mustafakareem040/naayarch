// components/MyOrders.jsx
'use client';

import React, { useState } from 'react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {CircleArrowLeft, Search, Filter, Check, MapPin, Copy} from 'lucide-react';
import EmptyOrders from './EmptyOrders';
import FilterModal from "@/components/FilterModel";
import useFetchOrders from "@/components/useFetchOrders";

const OrderCard = ({ order }) => {
    const [copied, setCopied] = useState(false);

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear().toString().slice(-2);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year}, ${hours}:${minutes}`;
    };

    const handleCopy = (e) => {
        e.preventDefault(); // Prevent navigating when clicking the copy button
        navigator.clipboard.writeText(order.id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="bg-white font-serif rounded-lg font-medium shadow-md p-4 max-w-lg mx-auto block">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-lg">Order ID</h2>
                    <span className="text-[#695C5C] text-sm font-normal">#{order.id}</span>
                    <button onClick={handleCopy} className="focus:outline-none">
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                    </button>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${order.status === 'Complete' ? 'bg-emerald-500 text-white' : order.status === 'Cancelled' ? 'bg-red-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
                    {order.status}
                </span>
            </div>
            <div className="flex mb-4 -space-x-4">
                {order.items.map((item, index) => (
                    <Image
                        key={index}
                        src={`https://storage.naayiq.com/resources/${item.product.images[0].url}`} // Assuming the first image
                        width={80}
                        height={80}
                        alt={`Product ${index + 1}`}
                        className="rounded-full object-cover border-2 border-white"
                        style={{ zIndex: order.items.length - index }}
                    />
                ))}
            </div>
            <div className="flex gap-4 items-baseline mb-4 py-2 border-[#695C5C]/30 border-solid border-b">
                <span className="text-[#695C5C] text-sm font-normal">{order.items.reduce((acc, item) => acc + item.quantity, 0)} Product{order.items.reduce((acc, item) => acc + item.quantity, 0) > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-baseline justify-between font-normal text-black">
                <div className="flex items-center">
                    {/* Assuming location is part of the cart data */}
                    <MapPin size={16} className="mr-2" />
                    <span className="mr-4 text-lg">{order.address}</span>
                </div>
                <span className="text-[#695C5C] font-medium text-sm">{formatDate(order.created_at)}</span>
            </div>
        </div>
    );
};

const MyOrders = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({ status: 'All', duration: 'Any Time' });
    const { orders, loading, error } = useFetchOrders(/* Pass user ID if needed */);

    // Handle Filter Application
    const handleApplyFilters = (appliedFilters) => {
        setFilters(appliedFilters);
        setIsFilterOpen(false);
    };

    // Filter Logic
    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.id.toString().includes(searchTerm) || order.full_name.toLowerCase().includes(searchTerm.toLowerCase()) || order.address.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === 'All' || order.status.toLowerCase() === filters.status.toLowerCase();

        // Duration Filter Logic
        let matchesDuration = true;
        const orderDate = new Date(order.created_at);
        const now = new Date();
        if (filters.duration !== 'Any Time') {
            let compareDate;
            switch (filters.duration) {
                case 'This Month':
                    compareDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                case 'Last 3 Months':
                    compareDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                    break;
                case 'Last Year':
                    compareDate = new Date(now.getFullYear() - 1, now.getMonth(), 1);
                    break;
                default:
                    compareDate = new Date(0);
            }
            matchesDuration = orderDate >= compareDate;
        }

        return matchesSearch && matchesStatus && matchesDuration;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl">Loading orders...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl text-red-500">Error: {error}</p>
            </div>
        );
    }

    if (orders.length === 0) {
        return <EmptyOrders />;
    }

    return (
        <div className="mt-2 px-4">
            <header className="flex items-center mb-6">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={() => router.back()} className="p-2 relative z-20 cursor-pointer" />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">My Orders</h1>
            </header>
            <div className="flex font-serif items-center mb-4">
                <div className="relative flex-grow">
                    <input
                        type="text"
                        placeholder="Search for orders"
                        className="w-full py-2 pl-10 pr-4 border rounded-l-lg"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                </div>
                <button
                    className="flex items-center bg-gray-100 py-2 px-4 rounded-r-lg ml-2"
                    onClick={() => setIsFilterOpen(true)}
                >
                    <Filter size={20} className="mr-2" />
                    Filter
                </button>
            </div>
            {filteredOrders.length > 0 ? (
                <div className="space-y-4">
                    {filteredOrders.map((order) => (
                        <OrderCard key={order.id} order={order} />
                    ))}
                </div>
            ) : (
                <EmptyOrders />
            )}
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={handleApplyFilters}
            />
        </div>
    );
};

export default MyOrders;