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
            <AsyncNavBar/>
            <Suspense fallback={<ProductLoading />}>
                <ProductList />
            </Suspense>
        </>
    );
}

export default ProductsPage;