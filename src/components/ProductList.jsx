'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import ProductItem from './ProductItem';
import ProductLoading from '@/components/ProductLoading';
import NoProductsFound from '@/components/NoProductsFound';
import ProductDetail from '@/components/ProductDetail';
import {NotificationProvider} from '@/components/NotificationContext';

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />
});

const ProductModal = dynamic(() => import('@/components/ProductDetailModal'), {
    ssr: false
});

export default function ProductList({ initialFilters }) {
    const { c, sc, b, title, sortBy } = initialFilters;
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [filter, setFilter] = useState('');
    const [query, setQuery] = useState('');
    const [wishlist, setWishlist] = useState([])
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(250000); // Adjust based on your data
    const [detail, setDetail] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const first = useRef(true);
    const { ref, inView } = useInView({
        threshold: 0,
        triggerOnce: false
    });
    const [shouldScroll, setShouldScroll] = useState(false);
    const scroll = useRef(0);

    const fetchWishlist = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const w = await response.json();
                const wishlistIds = w.wishlist.map(item => item.id);
                setWishlist(wishlistIds);
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }, [setWishlist]);

    const pathname = usePathname(); // Import and use usePathname

    const fetchProducts = useCallback(async (currentPage, searchQuery) => { // Added searchQuery
        setLoading(true);
        setError(null);
        try {
            await fetchWishlist()
            const params = new URLSearchParams({
                page: currentPage,
                itemsPerPage: 15, // Can be adjusted or made dynamic
            });

            if (c) params.append('c', c);
            if (sc) params.append('sc', sc);
            if (b) params.append('b', b);
            if (sortBy) params.append("sortBy", sortBy);
            if (searchQuery) params.append('search', searchQuery); // Use searchQuery
            if (minPrice) params.append('minPrice', minPrice);
            if (maxPrice && maxPrice !== Infinity) params.append('maxPrice', maxPrice);
            if (filter) params.append('filter', filter); // Ensure filter is appended correctly


            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products?${params.toString()}&${filter}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            setProducts((prev) => [...prev, ...data.products]);
            setHasMore(data.hasMore);
            setPage((prev) => prev + 1);
            // After the initial fetch, set first.current to false
            if (first.current) {
                first.current = false;
            }
        } catch (err) {
            console.error('Error fetching products:', err);
            setError(err.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [c, sc, b, minPrice, maxPrice, filter, fetchWishlist, sortBy]);
    useEffect(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        setLoading(true)
        first.current = true;
        setQuery("")
        fetchProducts(1, "")
    }, [c, sc, b, title]);

    // Fetch more products when in view
    useEffect(() => {
        if (inView && hasMore && !loading && !first.current) {
            fetchProducts(page, query); // Pass current query
        }
    }, [inView, hasMore, loading, fetchProducts, page, query]);

    // Handle search functionality
    const handleSearch = useCallback((newQuery) => {
        if (!loading) {
            setQuery(newQuery);
            setProducts([]);
            setPage(1);
            setHasMore(true);
            first.current = true;
            fetchProducts(1, newQuery); // Pass newQuery
        }
    }, [fetchProducts, loading]);

    // Handle filter changes
    const handleFilterChange = useCallback(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        first.current = true; // Reset first ref when filtering
        fetchProducts(1, query); // Pass current query
    }, [fetchProducts, query]);

    // Watch for filter changes
    useEffect(() => {
        if (!first.current) {
            handleFilterChange();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    useEffect(() => {
        if (pathname === '/products') {
            setDetail(null);
            setShouldScroll(true);
        }
    }, [pathname]);
    useEffect(() => {
        if (shouldScroll) {
            window.scrollTo(0, scroll.current);
            setShouldScroll(false);
        }
    }, [shouldScroll]);
    const handleProductClick = useCallback((product) => {
        scroll.current = window.scrollY;
        setDetail(product);
        const newURL = `/products/${product.id}`;
        window.history.pushState({ path: newURL }, '', newURL);
    }, [scroll]);


    // Handle cart interactions
    const handleCartClick = useCallback((product) => {
        setSelectedProduct(product);
    }, []);

    const handleModalClose = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    const memoizedProducts = useMemo(() => products.map((product) => ({
        ...product,
        cheapestPrice: getCheapestPrice(product),
    })), [products]);

    return (
        <>
            {detail ? (
                <NotificationProvider>
                    <ProductDetail product={detail} isInWishlist={wishlist.includes(detail.id)} />
                </NotificationProvider>
            ) : (
                <>
                    <header className="flex justify-center relative mt-20 mb-4">
                        <h1 className="text-3xl z-10 text-[#181717] font-sans text-center font-medium">
                            {title || 'All Products'}
                        </h1>
                    </header>
                    <SearchComponent
                        minPrice={minPrice}
                        maxPrice={maxPrice}
                        query={query}
                        setQuery={handleSearch}
                        filterQuery={filter}
                        setFilterQuery={setFilter}
                    />
                    {error && <div className="text-red-500 text-center">{error}</div>}
                    {memoizedProducts.length > 0 ? (
                        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                            {memoizedProducts.map((product) => (
                                <ProductItem
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    isInWishlist={wishlist.includes(product.id)}
                                    product={product}
                                    handleClick={() => handleProductClick(product)}
                                    price={formatPrice(product.cheapestPrice)}
                                    imageUrl={product.images[0]?.url || ''}
                                    onCartClick={handleCartClick}
                                />
                            ))}
                        </div>
                    ) : (
                        // Only show NoProductsFound if not loading and not the first load
                        !loading && !first.current && <NoProductsFound />
                    )}
                    {loading && <ProductLoading />}
                    {!loading && hasMore && (
                        <div ref={ref} style={{ height: '20px' }}></div>
                    )}
                </>
            )}
            {selectedProduct && (
                <NotificationProvider>
                    <ProductModal
                        productData={{ product: selectedProduct }}
                        isOpen={!!selectedProduct}
                        onClose={handleModalClose}
                    />
                </NotificationProvider>
            )}
        </>
    );
}

const getCheapestPrice = (product) => {
    const prices = [
        product.price && product.price !== '0.00'
            ? parseFloat(product.price)
            : Infinity,
        ...(product.sizes?.map((size) => parseFloat(size.price)) || []),
        ...(product.colors?.flatMap((color) => [
            parseFloat(color.price),
            ...(color.sizes?.map((size) => parseFloat(size.price)) || []),
        ]) || []),
    ].filter((price) => !isNaN(price) && isFinite(price));

    return prices.length > 0 ? Math.min(...prices) : null;
};

const formatPrice = (price) => {
    if (price == null || price === Infinity) return 'N/A';
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
};

const SearchComponentSkeleton = () => (
    <div className="flex mb-4 items-center space-x-2 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
        <div className="h-10 w-[5.5rem] bg-gray-200 rounded-md"></div>
    </div>
);