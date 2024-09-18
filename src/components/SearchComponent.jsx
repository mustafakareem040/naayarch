'use client'
import React, { useState, useCallback, useRef, useMemo, useEffect } from 'react';
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { debounce } from 'lodash';
import FilterComponent from "@/components/FilterComponent";

const SearchComponent = ({ query: initialQuery, setQuery, minPrice, maxPrice }) => {
    const [localQuery, setLocalQuery] = useState(initialQuery);
    const [filter, setFilter] = useState(false);
    const modalRef = useRef(null);

    const debouncedSearch = useMemo(
        () => debounce((value) => {
            setQuery(value);
        }, 300),
        [setQuery]
    );

    const handleInputChange = useCallback((e) => {
        const value = e.target.value;
        setLocalQuery(value);
        debouncedSearch(value);
    }, [debouncedSearch]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        setQuery(localQuery);
    }, [localQuery, setQuery]);

    const toggleFilter = useCallback(() => {
        setFilter(prev => !prev);
    }, []);

    const MemoizedFilterComponent = useMemo(() => (
        <FilterComponent minPrice={minPrice} maxPrice={maxPrice} modalRef={modalRef} onFilter={() => {}} filter={filter} setFilter={setFilter} />
    ), [filter, minPrice, maxPrice]);

    return (
        <>
            <form onSubmit={handleSubmit} className="flex mb-4 items-center space-x-2">
                <div className="relative font-serif mr-4 flex-grow">
                    <input
                        type="text"
                        placeholder="Search for product"
                        value={localQuery}
                        onChange={handleInputChange}
                        className="w-full font-serif text-sm pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B5345]/50"
                        autoComplete="off"
                    />
                    <Image
                        src="https://storage.naayiq.com/resources/search.svg"
                        width={20}
                        unoptimized={true}
                        height={20}
                        alt="search"
                        className="absolute opacity-50 left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                </div>
                <button
                    type="button"
                    className="py-2 w-[5.5rem] font-sans border flex justify-around px-2 bg-[#3B5345] text-white items-center rounded-md"
                    onClick={toggleFilter}
                >
                    <Image
                        src="https://storage.naayiq.com/resources/filter.svg"
                        width={20}
                        unoptimized={true}
                        height={20}
                        alt="filter"
                        className="fill-white"
                    />
                    <span className="text-sm">Filter</span>
                </button>
            </form>
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

export default React.memo(SearchComponent);