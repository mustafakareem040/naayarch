'use client';

import React, { useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

const Pagination = ({ currentPage, totalPages }) => {
    const router = useRouter();
    const searchParams = useSearchParams();

    const getPageNumbers = useCallback(() => {
        const pageNumbers = [];
        if (totalPages <= 4) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);
            if (currentPage > 3) {
                pageNumbers.push('...');
            }
            const start = Math.max(2, currentPage - 1);
            const end = Math.min(totalPages - 1, currentPage + 1);
            for (let i = start; i <= end; i++) {
                pageNumbers.push(i);
            }
            if (currentPage < totalPages - 2) {
                pageNumbers.push('...');
            }
            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    }, [currentPage, totalPages]);

    const createPageUrl = useCallback((pageNumber) => {
        const params = new URLSearchParams(searchParams);
        params.set('page', pageNumber.toString());
        return `/products?${params.toString()}`;
    }, [searchParams]);

    return (
        <div className="flex font-serif flex-row justify-center items-center gap-2 w-full mt-6 overflow-x-auto py-2 text-sm">
            <Link
                href={createPageUrl(currentPage - 1)}
                className={`px-2 py-1 bg-gray-100 rounded-md text-black ${currentPage === 1 ? 'pointer-events-none opacity-50' : ''}`}
            >
                Previous
            </Link>
            <div className="flex flex-row items-center gap-1">
                {getPageNumbers().map((number, index) => (
                    <React.Fragment key={index}>
                        {number === '...' ? (
                            <span className="w-6 text-gray-600 text-center">...</span>
                        ) : (
                            <Link
                                href={createPageUrl(number)}
                                className={`w-8 h-8 flex-shrink-0 flex justify-center items-center rounded-md ${
                                    currentPage === number
                                        ? 'bg-[#3B5345] text-white font-bold'
                                        : 'text-black'
                                }`}
                            >
                                {number}
                            </Link>
                        )}
                    </React.Fragment>
                ))}
            </div>
            <Link
                href={createPageUrl(currentPage + 1)}
                className={`px-2 py-1 bg-gray-100 rounded-md text-black ${currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}`}
            >
                Next
            </Link>
        </div>
    );
};

export default Pagination;