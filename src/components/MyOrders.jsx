'use client'
import React, {useEffect, useRef, useState} from 'react';
import Image from "next/image";
import {useRouter} from "next/navigation";

import { MapPin, Search, Copy, X, Check } from 'lucide-react';
import Link from "next/link";

const OrderCard = ({ id, status, productImages, price, quantity, orderDate, location }) => {
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

    const handleCopy = () => {
        navigator.clipboard.writeText(id);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Link href={"/profile/orders/detail"} className="bg-white font-sans rounded-lg font-medium shadow-md p-4 max-w-sm">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-baseline gap-3">
                    <h2 className="text-lg">Order ID</h2>
                    <span className="text-[#695C5C] text-sm font-normal">#{id}</span>
                    <button onClick={handleCopy} className="focus:outline-none">
                        {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} className="text-gray-400" />}
                    </button>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${status === 'Complete' ? 'bg-emerald-500 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {status}
        </span>
            </div>
            <div className="flex mb-4 -space-x-4">
                {productImages.map((image, index) => (
                    <Image
                        key={index}
                        src={image}
                        width={80}
                        height={80}
                        alt={`Product ${index + 1}`}
                        className="rounded-full object-cover border-2 border-white"
                        style={{ zIndex: productImages.length - index }}
                    />
                ))}
            </div>
            <div className="flex gap-4 items-baseline mb-4 py-2 border-[#695C5C]/30 border-solid border-b">
                <span className="text-lg">{price.toLocaleString()} IQD</span>
                <span className="text-[#695C5C] text-sm font-normal">{quantity} Product{quantity > 1 ? 's' : ''}</span>
            </div>
            <div className="flex items-baseline justify-between font-normal text-black">
                <div className="flex items-center">
                    <MapPin size={16} className="mr-2" />
                    <span className="mr-4 text-lg">{location}</span>
                </div>
                <span className="text-[#695C5C] font-medium text-sm">{formatDate(orderDate)}</span>
            </div>
        </Link>
    );
};



const FilterModal = ({ isOpen, onClose, onApply }) => {
    const [status, setStatus] = useState('All');
    const [duration, setDuration] = useState('Any Time');
    const [isAnimating, setIsAnimating] = useState(true);
    const modalRef = useRef(null);

    useEffect(() => {
        let animationTimeout;

        if (isOpen) {
            // For slide-up, we need a slight delay to allow the element to be rendered before animating
            animationTimeout = setTimeout(() => {
                if (modalRef.current) {
                    modalRef.current.style.transform = 'translateY(0)';
                }
            }, 50); // Adjust the delay (in milliseconds) as needed
        } else {
            if (modalRef.current) {
                modalRef.current.style.transform = 'translateY(100%)';
            }
        }

        return () => clearTimeout(animationTimeout);
    }, [isOpen]);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleApply = () => {
        onApply({ status, duration });
        handleClose();
    };

    const handleReset = () => {
        setStatus('All');
        setDuration('Any Time');
    };

    const handleClose = () => {
        setIsAnimating(true);
        setTimeout(function() {
            onClose()
        }, 300)
        setTimeout(function() {
            setIsAnimating(false)
        }, 400)
    }


    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleClose();
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div
            className={`fixed inset-0 items-end bg-black bg-opacity-50 flex bottom-0 top-0 z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                style={{ transform: 'translateY(100%)' }} // Initial state: hidden
                className={`bg-white max-h-[80vh] justify-end rounded-lg w-full flex flex-col transition-transform duration-300 ease-in-out`}
            >


                <div className="flex justify-center pt-2">
                    <svg width="36" height="6" viewBox="0 0 36 6" fill="none" xmlns="http://www.w3.org/2000/svg"
                         onClick={handleClose}>
                        <rect opacity="0.7" width="36" height="6" rx="3" fill="#00003C"/>
                    </svg>
                </div>
                <div className="p-4 font-sans font-medium border-b flex justify-between items-center">
                    <h2 className="text-xl">Filter Orders</h2>
                    <button className="text-[#97C86C] text-sm font-medium" onClick={handleReset}>
                        Reset Filter
                    </button>
                </div>
                <div className="flex-grow font-medium font-serif overflow-auto p-4">
                    <div className="mb-6">
                        <h3 className="text-base font-sans mb-4">Status</h3>
                        {['All', 'On the way', 'Delivered', 'Cancelled'].map((option) => (
                            <label key={option} className="flex font-normal items-center mb-4 cursor-pointer">
                                <input
                                    type="radio"
                                    className="hidden"
                                    checked={status === option}
                                    onChange={() => setStatus(option)}
                                />
                                <div
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${status === option ? 'border-[#3B5345] bg-white' : 'border-gray-300'}`}>
                                    {status === option && <div className="w-4 h-4 bg-[#97C86C] rounded-full"></div>}
                                </div>
                                <span className="text-lg">{option}</span>
                            </label>
                        ))}
                    </div>
                    <div>
                        <h3 className="text-base font-sans mb-4">Duration</h3>
                        {['Any Time', 'This Month', 'Last 3 Months', 'Last Year'].map((option) => (
                            <label key={option} className="flex font-normal items-center mb-4 cursor-pointer">
                                <input
                                    type="radio"
                                    className="hidden"
                                    checked={duration === option}
                                    onChange={() => setDuration(option)}
                                />
                                <div
                                    className={`w-6 h-6 rounded-full border flex items-center justify-center mr-3 ${duration === option ? 'bg-white border-[#3B5345]' : 'border-gray-300'}`}>
                                    {duration === option && <div className="w-4 h-4 bg-[#97C86C] rounded-full"></div>}
                                </div>
                                <span className="text-lg">{option}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div className="p-4">
                    <button
                        className="w-full font-sans bg-[#3B5345] text-white py-3 rounded-lg text-lg font-medium"
                        onClick={handleApply}
                    >
                        Apply Filter
                    </button>
                </div>
            </div>
        </div>
    );
};

const MyOrders = () => {
    const router = useRouter();
    const [searchTerm, setSearchTerm] = useState('');
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filters, setFilters] = useState({status: '', date: ''});

    const orders = [
        {
            id: '1000000',
            date: Date.now(),
            status: 'Complete',
            location: 'Baghdad arasat',
            price: 150000,
            quantity: 6,
            productImages: ["/water.png", '/cream.png'],
        },
        {
            id: '1020000',
            date: Date.now(),
            status: 'Canceled',
            location: 'Baghdad arasat',
            price: 150000,
            quantity: 6,
            productImages: ["/water.png", '/cream.png']
        },
        {
            id: '1030000',
            date: Date.now(),
            status: 'On The Way',
            location: 'Baghdad arasat',
            price: 150000,
            quantity: 6,
            productImages: ["/water.png", '/cream.png'],
        },
    ];

    const filteredOrders = orders.filter((order) => {
        const matchesSearch = order.id.includes(searchTerm) || order.location.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filters.status === 'All' || order.status === filters.status;
        const matchesDuration = filters.duration === 'Any Time' || (
            filters.duration === 'Past Month' && /* add logic for this month */ true ||
            filters.duration === 'Past 3 Months' && /* add logic for last 3 months */ true ||
            filters.duration === 'Past Year' && /* add logic for last year */ true
        );
        return matchesSearch && matchesStatus && matchesDuration;
    });

    return (
        <div className="mt-2 px-4">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left" />
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">My Orders</h1>
            </header>
            <div className="flex items-center mb-4">
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
                    className="bg-gray-100 py-2 px-4 rounded-r-lg"
                    onClick={() => setIsFilterOpen(true)}
                >
                    Filter
                </button>
            </div>
            <div className="space-y-4">
                {filteredOrders.map((order) => (
                    <OrderCard
                        key={order.id}
                        id={order.id}
                        status={order.status}
                        price={order.price}
                        quantity={order.quantity}
                        orderDate={order.date}
                        location={order.location}
                        productImages={order.productImages}
                    />
                ))}
            </div>
            <FilterModal
                isOpen={isFilterOpen}
                onClose={() => setIsFilterOpen(false)}
                onApply={setFilters}
            />
        </div>
    );
};

export default MyOrders;