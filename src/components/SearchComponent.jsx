'use client'
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Image from "next/image";
import FilterComponent from "@/components/FilterComponent";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter, useSearchParams } from 'next/navigation';

const SearchComponent = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [localQuery, setLocalQuery] = useState(searchParams.get('search') || '');
    const [filter, setFilter] = useState(false);
    const modalRef = useRef(null);

    useEffect(() => {
        setLocalQuery(searchParams.get('search') || '');
    }, [searchParams]);

    const debounce = useCallback((func, delay) => {
        let timeoutId;
        return (...args) => {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => func(...args), delay);
        };
    }, []);

    const debouncedSearch = useCallback(
        debounce((value) => {
            const params = new URLSearchParams(searchParams);
            params.set('search', value);
            params.set('page', '1');
            router.push(`/products?${params.toString()}`);
        }, 300),
        [router, searchParams, debounce]
    );

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setLocalQuery(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const toggleFilter = useCallback(() => {
        setFilter(prev => !prev);
    }, []);

    const MemoizedFilterComponent = useMemo(() => (
        <FilterComponent modalRef={modalRef} onFilter={() => {}} filter={filter} setFilter={setFilter} />
    ), [filter]);

    return (
        <>
            <div className="flex mb-4 items-center space-x-2">
                <div className="relative font-serif mr-4 flex-grow">
                    <input
                        type="text"
                        placeholder="Search for product"
                        value={localQuery}
                        onChange={handleInputChange}
                        className="w-full font-serif text-sm pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B5345]/50"
                    />
                    <Image
                        src="/search.svg"
                        width={20}
                        height={20}
                        alt="search"
                        className="absolute opacity-50 left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
                <button
                    className="py-2 w-[5.5rem] font-sans border flex justify-around px-2 bg-[#3B5345] text-white items-center rounded-md hover:bg-[#2E4238] focus:outline-none focus:ring-1 focus:ring-[#2E4238]"
                    onClick={toggleFilter}
                >
                    <Image
                        src="/filter.svg"
                        width={20}
                        height={20}
                        alt="filter"
                        className="fill-white"
                    />
                    <span className="text-sm">Filter</span>
                </button>
            </div>
            <AnimatePresence>
                {filter && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-30 w-full overflow-y-auto overflow-x-hidden z-50 flex items-end"
                    >
                        <motion.div
                            ref={modalRef}
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 500 }}
                            className="bg-white overflow-y-auto rounded-t-xl max-h-[80%] w-full p-6"
                        >
                            {MemoizedFilterComponent}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default SearchComponent;