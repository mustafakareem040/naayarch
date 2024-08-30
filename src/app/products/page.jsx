import React, { Suspense } from 'react';
import ProductList from '@/components/ProductList';
import SearchComponent from '@/components/SearchComponent';
import Pagination from '@/components/Pagination';
import { fetchProducts } from '@/lib/api';
import ProductSkeleton from "@/components/ProductSkeleton";
import Link from "next/link";
import Image from "next/image";
import AsyncNavBar from "@/components/AsyncNavBar";

export const dynamic = 'force-dynamic';
export const experimental_ppr = true
async function ProductsPage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const search = searchParams.search || '';
    const category = searchParams.c || '';
    const subCategory = searchParams.sc || '';

    const { products, pagination } = await fetchProducts(page, search, category, subCategory);

    return (
        <>
            <AsyncNavBar />
            <header className="flex items-center mb-6">
                <Link className="relative z-20" href={"/"}>
                    <Image src="/arrow-left.svg" unoptimized={true} width={40} height={40} alt="left" />
                </Link>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>

            <Suspense fallback={<div>Loading search...</div>}>
                <SearchComponent />
            </Suspense>

            <Suspense fallback={<ProductSkeleton />}>
                <ProductList initialProducts={products} />
            </Suspense>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </>
    );
}

export default ProductsPage;