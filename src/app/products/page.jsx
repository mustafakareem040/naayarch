import React, { Suspense } from 'react';
import Link from "next/link";
import Image from "next/image";
import ProductLoading from "@/components/ProductLoading";
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const runtime = 'edge';

export const revalidate = 3600; // Revalidate every hour

async function ProductsPage() {
    return (
        <>
            <AsyncNavBar />
            <header className="flex items-center mb-6">
                <Link prefetch={true} className="relative z-20" href={"/"}>
                    <Image src="https://storage.naayiq.com/resources/arrow-left.svg" width={40} unoptimized={true} height={40} alt="left" priority />
                </Link>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>

            <Suspense fallback={<ProductLoading />}>
                <ProductList />
            </Suspense>
        </>
    );
}

export default ProductsPage;