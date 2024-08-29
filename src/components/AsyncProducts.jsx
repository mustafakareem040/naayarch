'use client'
import SearchComponent from "@/components/SearchComponent";
import React, { Suspense, useState, useEffect, useCallback, lazy } from "react";
import {useRouter, useSearchParams} from "next/navigation";
import Image from "next/image"
import ProductSkeleton from "@/components/ProductSkeleton";
const Pagination = lazy(() => import("@/components/Pagination"));
const ProductsList = lazy(() => import("@/components/ProductList"));

const ProductsWithSearchParams = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);
    const [products, setProducts] = useState([]);
    const [query, setQuery] = useState("");
    const [category, setCategory] = useState("");
    const [subcategory, setSubcategory] = useState("");
    const [error, setError] = useState(null);

    useEffect(() => {
        const categoryParam = searchParams.get('c');
        const subcategoryParam = searchParams.get('sc');
        if (categoryParam) setCategory(categoryParam);
        if (subcategoryParam) setSubcategory(subcategoryParam);
    }, [searchParams]);

    const handleSearch = useCallback((searchQuery) => {
        setQuery(searchQuery);
        setCurrentPage(1);
    }, []);

    const fetchProducts = useCallback(async (page, search, cat, subcat) => {
        setIsLoading(true);
        setError(null);
        try {
            let url = `https://api.naayiq.com/products?page=${page}&search=${encodeURIComponent(search)}`;
            if (cat) url += `&c=${encodeURIComponent(cat)}`;
            if (subcat) url += `&sc=${encodeURIComponent(subcat)}`;

            const response = await fetch(url);
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
        fetchProducts(currentPage, query, category, subcategory);
    }, [currentPage, query, category, subcategory, fetchProducts]);

    const handlePageChange = useCallback((pageNumber) => {
        setCurrentPage(pageNumber);
    }, []);

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
                    <></>
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
};

// Main component wrapped in Suspense
export default function AsyncProducts() {
    return (
        <Suspense fallback={<ProductsLoadingSkeleton />}>
            <ProductsWithSearchParams />
        </Suspense>
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