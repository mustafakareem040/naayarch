// /app/products/page.jsx

import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const dynamic = 'force-dynamic';

const ProductsPage = ({ searchParams }) => {
    const { c = '', sc = '', b = '', title = '', sortBy = '' } = searchParams;

    return (
        <>
            <AsyncNavBar />
            <ProductList initialFilters={{ c, sc, b, title, sortBy }} />
        </>
    );
};

export default ProductsPage;