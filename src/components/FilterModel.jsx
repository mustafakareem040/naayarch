// components/FilterModal.jsx
'use client';

import React, { useEffect, useRef, useState } from 'react';

const FilterModal = ({ isOpen, onClose, onApply }) => {
    const [status, setStatus] = useState('All');
    const [duration, setDuration] = useState('Any Time');
    const [isAnimating, setIsAnimating] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
            document.body.style.overflow = 'hidden';
        } else {
            setIsAnimating(false);
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleApply = () => {
        onApply({ status, duration });
        onClose();
    };

    const handleReset = () => {
        setStatus('All');
        setDuration('Any Time');
    };

    const handleOutsideClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!isOpen && !isAnimating) return null;

    return (
        <div
            className={`fixed inset-0 flex items-end justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-300 ease-in-out ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
            onClick={handleOutsideClick}
        >
            <div
                ref={modalRef}
                className={`bg-white max-h-[80vh] rounded-t-lg w-full p-4 transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
                onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the modal
            >
                <div className="flex justify-center pb-4">
                    <div className="w-12 h-1 bg-gray-300 rounded-full" onClick={onClose}></div>
                </div>
                <div className="p-4">
                    <h2 className="text-xl font-semibold mb-4">Filter Orders</h2>
                    <div className="mb-6">
                        <h3 className="text-base font-medium mb-2">Status</h3>
                        {['All', 'On the way', 'Delivered', 'Cancelled'].map((option) => (
                            <label key={option} className="flex items-center mb-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="status"
                                    value={option}
                                    checked={status === option}
                                    onChange={() => setStatus(option)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 mr-2 flex items-center justify-center border ${status === option ? 'border-green-500' : 'border-gray-300'} rounded-full`}>
                                    {status === option && <span className="w-2 h-2 bg-green-500 rounded-full"></span>}
                                </span>
                                {option}
                            </label>
                        ))}
                    </div>
                    <div className="mb-6">
                        <h3 className="text-base font-medium mb-2">Duration</h3>
                        {['Any Time', 'This Month', 'Last 3 Months', 'Last Year'].map((option) => (
                            <label key={option} className="flex items-center mb-2 cursor-pointer">
                                <input
                                    type="radio"
                                    name="duration"
                                    value={option}
                                    checked={duration === option}
                                    onChange={() => setDuration(option)}
                                    className="hidden"
                                />
                                <span className={`w-4 h-4 mr-2 flex items-center justify-center border ${duration === option ? 'border-blue-500' : 'border-gray-300'} rounded-full`}>
                                    {duration === option && <span className="w-2 h-2 bg-blue-500 rounded-full"></span>}
                                </span>
                                {option}
                            </label>
                        ))}
                    </div>
                    <div className="flex justify-end gap-4">
                        <button
                            className="px-4 py-2 bg-red-500 text-white rounded-lg"
                            onClick={handleReset}
                        >
                            Reset
                        </button>
                        <button
                            className="px-4 py-2 bg-green-500 text-white rounded-lg"
                            onClick={handleApply}
                        >
                            Apply
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FilterModal;