import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import Link from "next/link";
import Image from "next/image";
import AsyncNavBar from "@/components/AsyncNavBar";
import ProductLoading from "@/components/ProductLoading";
import { fetchInitialProducts } from "@/lib/api";

const ProductList = dynamic(() => import('@/components/ProductList'), {
    loading: () => <ProductLoading />,
});

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    loading: () => <ProductLoading />,
});


async function ProductsPage({ searchParams }) {
    const page = 1;
    const category = searchParams.c || '';
    const subCategory = searchParams.sc || '';

    const initialProducts = await fetchInitialProducts(page, '', category, subCategory);

    return (
        <>
            <AsyncNavBar />
            <header className="flex items-center mb-6">
                <Link className="relative z-20" href={"/"}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left" priority />
                </Link>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>

            <Suspense fallback={<ProductLoading />}>
                <ProductList initialProducts={initialProducts} />
            </Suspense>
        </>
    );
}

export default ProductsPage;