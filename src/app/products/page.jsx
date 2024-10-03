// /app/products/page.jsx

import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const revalidate = 14400;
export const metadata = {
    title: "Products",
    description: "Explore our wide range of Korean and global beauty products. Find skincare, makeup, and body care items from top brands at Naay.",
    openGraph: {
        title: "Products",
        description: "Discover premium beauty products from Korean and global brands at Naay. Your trusted source for skincare, makeup, and body care in Iraq.",
    },
};
const ProductsPage = async ({ searchParams }) => {
    const resolvedSearchParams = await searchParams;

    const { c = '', sc = '', b = '', title = '', sortBy = '' } = await resolvedSearchParams;
    return (
        <>
            <AsyncNavBar />
            <ProductList initialFilters={{c, sc, b, title, sortBy}} />
        </>
    );
};

export default ProductsPage;