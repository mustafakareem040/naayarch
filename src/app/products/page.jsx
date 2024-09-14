// app/products/page.js
import React, { Suspense } from 'react';
import ProductLoading from "@/components/ProductLoading";
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';
export const experimental_ppr = true
export const revalidate = 84600; // Revalidate every day

async function fetchAllProducts() {
    const response = await fetch('https://api.naayiq.com/products', {
        headers: {
            'Content-Type': 'application/json',
        },
        next: {
            revalidate: 84600
        }
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }

    const data = await response.json();
    return data.products;
}

async function ProductsPage() {
    const products = await fetchAllProducts();

    return (
        <>
            <AsyncNavBar />
            <Suspense fallback={<ProductLoading />}>
                <ProductList initialProducts={products} />
            </Suspense>
        </>
    );
}

export default ProductsPage;