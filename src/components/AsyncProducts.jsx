'use client'
import SearchComponent from "@/components/SearchComponent";
import React, { Suspense, useState, useEffect } from "react";
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

    useEffect(() => {
        fetchProducts(currentPage);
    }, [currentPage]);

    const fetchProducts = async (page) => {
        setIsLoading(true);
        try {
            const response = await fetch(`https://api.naayiq.com/products?page=${page}`);
            const data = await response.json();
            setTotalPages(data.pagination.totalPages);
            setProducts(data.products);
            setIsLoading(false);
        } catch (error) {
            console.error("Error fetching products:", error);
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
            <SearchComponent/>
            <Suspense fallback={<ProductsLoadingSkeleton />}>
                {isLoading ? <ProductsLoadingSkeleton /> : <ProductsList products={products} />}
            </Suspense>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
            />
        </>
    );
}

function ProductsLoadingSkeleton() {
    return (
        <>
            <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {Array.from({length: 10}).map((_, index) => (
                    <ProductSkeleton key={index}/>
                ))}
            </div>
        </>
    );
}