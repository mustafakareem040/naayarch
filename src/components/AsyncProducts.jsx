'use client'
import SearchComponent from "@/components/SearchComponent";
import React, {Suspense, useState, useEffect, useCallback} from "react";
import ProductsList from "@/components/ProductList";
import ProductSkeleton from "@/components/ProductSkeleton";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Pagination from "@/components/Pagination";

export default function AsyncProducts() {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [error, setError] = useState(null);

    const handleSearch = useCallback((searchQuery) => {
        setQuery(searchQuery);
        setCurrentPage(1); // Reset to first page when searching
    }, []);

    useEffect(() => {
        fetchProducts(currentPage, query);
    }, [currentPage, query]);

    const fetchProducts = async (page, search) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://api.naayiq.com/products?page=${page}&search=${encodeURIComponent(search)}`);
            if (!response.ok) {
                throw new Error('Failed to fetch products');
            }
            const data = await response.json();
            if (data && data.products) {
                setProducts(data.products);
                if (data.pagination) {
                    setTotalPages(data.pagination?.totalPages || 1);
                    setCurrentPage(data.pagination?.currentPage || 1);
                } else {
                    setTotalPages(1);
                    setCurrentPage(1);
                }
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
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };


    return (
        <>
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>
            <SearchComponent onSearch={handleSearch}/>
            <Suspense fallback={<ProductsLoadingSkeleton />}>
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

function ProductsLoadingSkeleton() {
    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Array.from({length: 10}).map((_, index) => (
                <ProductSkeleton key={index}/>
            ))}
        </div>
    );
}