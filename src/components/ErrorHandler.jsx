'use client'
import React, { useState, useEffect } from 'react';

const ErrorHandler = ({ onRetry }) => {
    const [countdown, setCountdown] = useState(5);

    useEffect(() => {
        if (countdown > 0) {
            const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            onRetry();
        }
    }, [countdown, onRetry]);

    return (
        <div className="flex flex-col items-center justify-center h-64">
            <p className="text-red-500 text-xl mb-4">Failed to load products</p>
            <p className="mb-4">Retrying in {countdown} seconds...</p>
            <button
                onClick={onRetry}
                className="bg-[#3B5345] text-white px-4 py-2 rounded-md hover:bg-[#2E4238] focus:outline-none focus:ring-2 focus:ring-[#2E4238]"
            >
                Try again
            </button>
        </div>
    );
};

export default ErrorHandler;