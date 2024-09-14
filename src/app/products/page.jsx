import React, { Suspense } from 'react';
import ProductLoading from "@/components/ProductLoading";
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';


export const revalidate = 86400; // Revalidate every hour

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