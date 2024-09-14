// app/products/page.js
import React, { Suspense } from 'react';
import ProductLoading from "@/components/ProductLoading";
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const revalidate = 84600; // Revalidate every day

const ITEMS_PER_PAGE = 15;

async function fetchProducts(page = 1, query = '', c = '', sc = '') {
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

    let { products } = await response.json();

    // Create filter function once
    const filterProduct = (product) => {
        if (c && !product.categories.some(cat => cat.main_category_id?.toString() === c)) {
            return false;
        }
        if (sc && !product.categories.some(cat => cat.id?.toString() === sc)) {
            return false;
        }
        if (query) {
            const normalizedName = product.name.normalize('NFC').toLowerCase();
            const cleanName = normalizedName.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
            return cleanName.split(/\s+/).some(word => word.startsWith(query));
        }
        return true;
    };

    // Apply all filters at once
    products = products.filter(filterProduct);

    if (query) {
        const lowerQuery = query.toLowerCase();
        products.sort((a, b) => {
            const aIndex = a.name.toLowerCase().indexOf(lowerQuery);
            const bIndex = b.name.toLowerCase().indexOf(lowerQuery);
            return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        });
    }

    const totalProducts = products.length;
    const start = (page - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;

    return {
        products: products.slice(0, end),
        totalProducts,
        hasMore: end < totalProducts
    };
}

async function ProductsPage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const query = searchParams.query || '';
    const c = searchParams.c || '';
    const sc = searchParams.sc || '';

    const { products, totalProducts, hasMore } = await fetchProducts(page, query, c, sc);

    return (
        <>
            <AsyncNavBar />
            <Suspense fallback={<ProductLoading />}>
                <ProductList
                    initialProducts={products}
                    totalProducts={totalProducts}
                    hasMore={hasMore}
                    initialPage={page}
                    initialQuery={query}
                    initialC={c}
                    initialSc={sc}
                />
            </Suspense>
        </>
    );
}

export default ProductsPage;