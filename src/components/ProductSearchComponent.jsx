'use client'
import React, { useState, useEffect, useRef } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import Link from "next/link";

const ProductSearchComponent = () => {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        // Load recent searches from localStorage
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(savedSearches.slice(0, 5));

        // Fetch best selling products
        fetchBestSelling();
    }, []);

    const fetchBestSelling = async () => {
        try {
            const response = await fetch('https://dev.naayiq.com/products?page=1&sortBy=Best%20Selling&itemsPerPage=5&availability=in_stock');
            const data = await response.json();
            setBestSelling(data.products);
        } catch (error) {
            console.error('Error fetching best selling products:', error);
        }
    };

    const debouncedSearch = debounce(async (searchQuery) => {
        if (searchQuery.trim() === '') {
            setSearchResults([]);
            return;
        }

        try {
            const response = await fetch(`https://dev.naayiq.com/products?search=${encodeURIComponent(searchQuery)}&itemsPerPage=5`);
            const data = await response.json();
            setSearchResults(data.products);
        } catch (error) {
            console.error('Error searching products:', error);
        }
    }, 300);

    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    const handleRecentSearch = (search) => {
        setQuery(search);
        debouncedSearch(search);
        updateRecentSearches(search);
    };

    const updateRecentSearches = (search) => {
        const updatedSearches = [search, ...recentSearches.filter(s => s !== search)].slice(0, 5);
        setRecentSearches(updatedSearches);
        localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
    };

    const handleClearSearch = () => {
        setQuery('');
        setSearchResults([]);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const renderSearchItem = (item) => (
        <div key={item.id} className="flex items-center space-x-2 p-2 hover:bg-gray-100">
            {item.images && item.images[0] && (
                <Image
                    src={`https://storage.naayiq.com/resources/${item.images[0].url}`}
                    alt={item.name}
                    width={40}
                    height={40}
                    className="object-cover rounded"
                />
            )}
            <Link href={`products/${item.id}`} prefetch={false} className="flex-grow truncate">{item.name}</Link>
        </div>
    );

    return (
        <div className="w-full mt-24 font-serif max-w-md mx-auto relative">
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 200)}
                    placeholder="Search for product"
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {query && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>
            {isFocused && (
                <div className="absolute z-10 w-full mt-1 bg-white rounded-md max-h-96 overflow-y-auto">
                    {query === '' ? (
                        <>
                            {recentSearches.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent searches</h3>
                                    {recentSearches.map((search, index) => (
                                        <div
                                            key={index}
                                            onClick={() => handleRecentSearch(search)}
                                            className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
                                        >
                                            <Search size={16} className="text-gray-400" />
                                            <span>{search}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                            {bestSelling.length > 0 && (
                                <div className="p-2">
                                    <h3 className="text-sm font-medium text-gray-700 mb-2">Search Suggestions</h3>
                                    {bestSelling.map(renderSearchItem)}
                                </div>
                            )}
                        </>
                    ) : searchResults.length > 0 ? (
                        searchResults.map(renderSearchItem)
                    ) : (
                        <div className="p-4 text-center text-gray-500">No products found</div>
                    )}
                </div>
            )}
        </div>
    );
};

export default ProductSearchComponent;