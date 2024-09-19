import React from 'react';

const PriceDetailsSkeleton = () => {
    return (
        <div className="mt-8 bg-white rounded-lg shadow p-4 animate-pulse">
            <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
            <div className="mb-2">
                <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mr-2"></div>
                    <div className="h-8 bg-gray-300 rounded w-20"></div>
                </div>
                <div className="h-4 bg-gray-300 rounded w-1/4 mt-2"></div>
            </div>
            <div className="h-4 bg-gray-300 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-300 rounded w-1/3 mb-2"></div>
            <div className="h-6 bg-gray-300 rounded w-2/4 mt-4"></div>
        </div>
    );
};

export default PriceDetailsSkeleton;