'use client'
import React, {useCallback} from 'react';
import Image from "next/image";

const SearchComponent = ({ query, setQuery }) => {
    const handleInputChange = useCallback(function(e) {
        setQuery(e.target.value);
    }, []);
    return (
        <div className="flex mb-4 items-center space-x-2">
            <div className="relative mr-4 flex-grow">
                <input
                    type="text"
                    placeholder="Search for product"
                    value={query}
                    onChange={handleInputChange}
                    className="w-full text-sm pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-[#3B5345]/50"
                />
                <Image
                    src="/search.svg"
                    width={20}
                    height={20}
                    alt="search"
                    className="absolute opacity-50 left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
            </div>
            <button className="py-2 w-[5.5rem] font-sans border flex justify-around px-2 bg-[#3B5345] text-white items-center rounded-md hover:bg-[#2E4238] focus:outline-none focus:ring-1 focus:ring-[#2E4238]">
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
    );
};

export default SearchComponent;