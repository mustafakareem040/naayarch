'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Search, X } from 'lucide-react';
import Image from 'next/image';
import debounce from 'lodash/debounce';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {removeFileExtension} from "@/lib/api";

const ITEMS_PER_PAGE = 5; // Define items per page for consistency

const ProductSearchComponent = () => {
    const [query, setQuery] = useState('');
    const [recentSearches, setRecentSearches] = useState([]);
    const [bestSelling, setBestSelling] = useState([]);
    const [searchResults, setSearchResults] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [hasMore, setHasMore] = useState(false);
    const [isLoadingMore, setIsLoadingMore] = useState(false); // Separate loading state for "Show More"
    const containerRef = useRef(null); // Reference to the entire component
    const inputRef = useRef(null);

    // Fetch Best Selling Products
    const fetchBestSelling = useCallback(async () => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products?page=1&sortBy=Best%20Selling&itemsPerPage=${ITEMS_PER_PAGE}&availability=in_stock`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setBestSelling(data.products);
        } catch (error) {
            console.error('Error fetching best selling products:', error);
        }
    }, []);

    // Initialize recent searches and best-selling products
    useEffect(() => {
        // Load recent searches from localStorage
        const savedSearches = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        setRecentSearches(savedSearches.slice(0, 5));

        // Fetch best selling products
        fetchBestSelling();
    }, [fetchBestSelling]);

    // Update recent searches in state and localStorage
    const updateRecentSearches = useCallback(
        (search) => {
            if (search.trim() === '') return;
            setRecentSearches((prevSearches) => {
                const updatedSearches = [search, ...prevSearches.filter((s) => s !== search)].slice(0, 5);
                localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
                return updatedSearches;
            });
        },
        [] // Dependencies handled within setRecentSearches functional update
    );

    // Debounced search function using useMemo
    const debouncedSearch = useMemo(
        () =>
            debounce(async (searchQuery) => {
                if (searchQuery.trim() === '') {
                    setSearchResults([]);
                    setHasMore(false);
                    setCurrentPage(1);
                    return;
                }

                setIsLoading(true);
                try {
                    const response = await fetch(
                        `${process.env.NEXT_PUBLIC_API}/products?page=1&search=${encodeURIComponent(searchQuery)}&itemsPerPage=${ITEMS_PER_PAGE}`
                    );
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    const data = await response.json();
                    setSearchResults(data.products);
                    setCurrentPage(1); // Reset to first page
                    setHasMore(data.hasMore);
                    updateRecentSearches(searchQuery);
                } catch (error) {
                    console.error('Error searching products:', error);
                    setSearchResults([]);
                    setHasMore(false);
                } finally {
                    setIsLoading(false);
                }
            }, 300),
        [updateRecentSearches]
    );

    // Handle input change
    const handleSearch = (e) => {
        const newQuery = e.target.value;
        setQuery(newQuery);
        debouncedSearch(newQuery);
    };

    // Handle selection from recent searches
    const handleRecentSearch = useCallback((search) => {
        setQuery(search);
        debouncedSearch(search);
        setIsFocused(true); // Ensure dropdown is visible
    }, [debouncedSearch]);

    // Clear search input and results
    const handleClearSearch = () => {
        setQuery('');
        setSearchResults([]);
        setHasMore(false);
        setCurrentPage(1);
        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    // Fetch more results for pagination
    const fetchMoreResults = useCallback(async () => {
        const nextPage = currentPage + 1;
        setIsLoadingMore(true);
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API}/products?page=${nextPage}&search=${encodeURIComponent(query)}&itemsPerPage=${ITEMS_PER_PAGE}`
            );
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setSearchResults((prev) => [...prev, ...data.products]);
            setCurrentPage(nextPage);
            setHasMore(data.hasMore);
        } catch (error) {
            console.error('Error fetching more products:', error);
        } finally {
            setIsLoadingMore(false);
        }
    }, [currentPage, query]);

    // Click outside handler to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (containerRef.current && !containerRef.current.contains(event.target)) {
                setIsFocused(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Animation variants for the dropdown
    const dropdownVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 1, transition: { duration: 0 } }, // Immediate exit
    };

    // Animation variants for the list
    const listVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.05, // Small stagger for better performance
            },
        },
    };

    // Animation variants for each item
    const itemVariants = {
        hidden: { opacity: 0, y: 5 },
        visible: { opacity: 1, y: 0 },
    };

    // Render individual search items (best-selling products or search results)
    const renderSearchItem = useCallback((item) => (
        <Link
            href={`/products/${item.id}`} // Ensure the URL is correct
            prefetch={false}
            className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer"
            onClick={() => updateRecentSearches(item.name)}
        >
            {item.images && item.images[0] && (
                <Image
                    src={`https://storage.naayiq.com/resources/${removeFileExtension(item.images[0].url)}_optimized.webp`}
                    alt={item.name}
                    width={40}
                    unoptimized={true}
                    height={40}
                    className="object-cover rounded"
                />
            )}
            <span className="flex-grow truncate">{item.name}</span>
        </Link>
    ), [updateRecentSearches]);

    // Cleanup debounced function on unmount
    useEffect(() => {
        return () => {
            debouncedSearch.cancel();
        };
    }, [debouncedSearch]);

    return (
        <div
            className="w-full mt-24 font-serif max-w-md mx-auto relative"
            ref={containerRef} // Attach ref to the container
        >
            {/* Search Input */}
            <div className="relative">
                <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={handleSearch}
                    onFocus={() => setIsFocused(true)}
                    placeholder="Search for product"
                    className="w-full p-2 pl-10 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                {query && (
                    <button
                        onClick={handleClearSearch}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none"
                        aria-label="Clear search"
                    >
                        <X size={20} />
                    </button>
                )}
            </div>

            {/* Recent Searches */}
            {!isFocused && recentSearches.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="rounded-md p-4 mt-2"
                >
                    <h3 className="text-sm font-medium text-gray-700 mb-2">Recent Searches</h3>
                    <AnimatePresence>
                        {recentSearches.map((search, index) => (
                            <motion.div
                                key={index}
                                onClick={() => handleRecentSearch(search)}
                                className="flex items-center space-x-2 p-2 hover:bg-gray-100 cursor-pointer rounded"
                                variants={itemVariants}
                                initial="hidden"
                                animate="visible"
                                exit="hidden" // Ensures proper exit state
                                transition={{ duration: 0.2 }}
                            >
                                <Search size={16} className="text-gray-400" />
                                <span>{search}</span>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            )}

            {/* Dropdown: Suggestions or Search Results */}
            <AnimatePresence>
                {isFocused && (query !== '' || searchResults.length > 0 || bestSelling.length > 0) && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="absolute z-10 w-full mt-1 rounded-md max-h-96 overflow-y-auto"
                    >
                        {query === '' ? (
                            <>
                                {bestSelling.length > 0 && (
                                    <motion.div
                                        className="p-4"
                                        variants={listVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Search Suggestions</h3>
                                        <motion.div variants="visible">
                                            {bestSelling.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={itemVariants}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {renderSearchItem(item)}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                    </motion.div>
                                )}
                            </>
                        ) : (
                            <>
                                {isLoading && currentPage === 1 ? (
                                    <motion.div
                                        className="p-4 text-center text-gray-500"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        Loading...
                                    </motion.div>
                                ) : searchResults.length > 0 ? (
                                    <>
                                        <motion.div
                                            className="p-4"
                                            variants={listVariants}
                                            initial="hidden"
                                            animate="visible"
                                        >
                                            {searchResults.map((item) => (
                                                <motion.div
                                                    key={item.id}
                                                    variants={itemVariants}
                                                    transition={{ duration: 0.2 }}
                                                >
                                                    {renderSearchItem(item)}
                                                </motion.div>
                                            ))}
                                        </motion.div>
                                        {hasMore && (
                                            <motion.div
                                                className="p-4 text-center"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                exit={{ opacity: 0 }}
                                                transition={{ duration: 0.2 }}
                                            >
                                                <button
                                                    onClick={fetchMoreResults}
                                                    disabled={isLoadingMore}
                                                    className="bg-transparent text-center mx-auto flex flex-col items-center justify-center text-gray-900"
                                                >
                                                    {isLoadingMore ? 'Loading...' : 'Show More'}
                                                    {!isLoadingMore && (
                                                        <div>
                                                            <svg
                                                                xmlns="http://www.w3.org/2000/svg"
                                                                width={24}
                                                                height={24}
                                                                viewBox="0 0 24 24"
                                                                fill="none"
                                                                stroke="currentColor"
                                                                strokeWidth={2}
                                                                strokeLinecap="round"
                                                                strokeLinejoin="round"
                                                                className="icon icon-tabler icons-tabler-outline icon-tabler-arrow-big-down-lines"
                                                            >
                                                                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                                                                <path d="M15 12h3.586a1 1 0 0 1 .707 1.707l-6.586 6.586a1 1 0 0 1 -1.414 0l-6.586 -6.586a1 1 0 0 1 .707 -1.707h3.586v-3h6v3z" />
                                                                <path d="M15 3h-6" />
                                                                <path d="M15 6h-6" />
                                                            </svg>
                                                        </div>
                                                    )}
                                                </button>
                                            </motion.div>
                                        )}
                                    </>
                                ) : (
                                    <motion.div
                                        className="p-4 text-center text-gray-500"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        No products found
                                    </motion.div>
                                )}
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProductSearchComponent;