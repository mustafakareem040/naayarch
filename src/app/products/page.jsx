// /app/products/page.jsx

import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const dynamic = 'force-dynamic';

const ProductsPage = async ({ searchParams }) => {
    // Await the searchParams Promise to get the actual params object
    const resolvedSearchParams = await searchParams;

    // Destructure the necessary parameters with default values
    const { c = '', sc = '', b = '', title = '', sortBy = '' } = resolvedSearchParams;
    console.log(c, sc, b, title)
    return (
        <>
            <AsyncNavBar />
            <ProductList initialFilters={{ c, sc, b, title, sortBy }} />
        </>
    );
};

export default ProductsPage;