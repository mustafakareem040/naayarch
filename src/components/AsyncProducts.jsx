'use client'
import SearchComponent from "@/components/SearchComponent";
import React, { Suspense, useState, useEffect, useCallback, lazy } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image"
import ProductSkeleton from "@/components/ProductSkeleton";
const Pagination = lazy(() => import("@/components/Pagination"));
const ProductsList = lazy(() => import("@/components/ProductList"));

export default function AsyncProducts() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);
    const [category, setCategory] = useState("");
    const [subCategory, setSubCategory] = useState("");

    const handleSearch = useCallback((searchQuery) => {
        setQuery(searchQuery);
        setCurrentPage(1);
    }, []);

    const fetchProducts = useCallback(async (page, search, c, sc) => {
        setIsLoading(true);
        setError(null);

        try {
            const url = new URL('https://api.naayiq.com/products');
            url.searchParams.append('page', page);
            url.searchParams.append('search', search);
            if (c) url.searchParams.append('c', c);
            if (sc) url.searchParams.append('sc', sc);

            const response = await fetch(url.toString());
            if (!response.ok) throw new Error('Failed to fetch products');
            const data = await response.json();
            if (data?.products) {
                setProducts(data.products);
                setTotalPages(data.pagination?.totalPages || 1);
                setCurrentPage(data.pagination?.currentPage || 1);
            } else {
                setProducts([]);
                setTotalPages(1);
                setCurrentPage(1);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError('Failed to load products. Please try again.');
            setProducts([]);
            setTotalPages(1);
            setCurrentPage(1);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        const c = searchParams.get('c') || '';
        const sc = searchParams.get('sc') || '';
        setCategory(c);
        setSubCategory(sc);
        fetchProducts(currentPage, query, c, sc);
    }, [currentPage, query, fetchProducts, searchParams]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

    return (
        <>
        <SearchComponent onSearch={handleSearch}/>
        <Suspense fallback={<ProductsLoadingSkeleton />}>
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>
            {isLoading ? (
                <ProductsLoadingSkeleton />
            ) : error ? (
                <div className="text-red-500 text-center">{error}</div>
            ) : products.length > 0 ? (
                <ProductsList products={products} />
            ) : (
                <div className="text-center">No products found.</div>
            )}
        </Suspense>
            {!isLoading && !error && products.length > 0 && (
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            )}
            </>
    );
}

const ProductsLoadingSkeleton = React.memo(() => (
    <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {Array.from({length: 10}).map((_, index) => (
            <ProductSkeleton key={index}/>
        ))}
    </div>
));

ProductsLoadingSkeleton.displayName = 'ProductsLoadingSkeleton';