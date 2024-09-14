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

    let products = await response.json();
    products = products.products;

    // Filter by category if specified
    if (c) {
        products = products.filter(product =>
            product.categories.some(cat => cat.main_category_id?.toString() === c.toString())
        );
    }

    // Filter by subcategory if specified
    if (sc) {
        products = products.filter(product =>
            product.categories.some(cat => cat.id?.toString() === sc.toString())
        );
    }

    // Search functionality
    if (query) {
        const normalizedQuery = query.normalize('NFC').toLowerCase();
        products = products.filter(product => {
            const normalizedName = product.name.normalize('NFC');
            const cleanName = normalizedName.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
            const productWords = cleanName.toLowerCase().trim().split(/\s+/);
            return productWords.some(productWord => {
                const cleanWord = productWord.replace(/[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g, '');
                return cleanWord.startsWith(normalizedQuery);
            });
        });

        products.sort((a, b) => {
            const aIndex = a.name.toLowerCase().indexOf(query.toLowerCase());
            const bIndex = b.name.toLowerCase().indexOf(query.toLowerCase());
            if (aIndex === -1 && bIndex === -1) return 0;
            if (aIndex === -1) return 1;
            if (bIndex === -1) return -1;
            return aIndex - bIndex;
        });
    }

    const start = 0;
    const end = (page - 1) * ITEMS_PER_PAGE + ITEMS_PER_PAGE;
    const paginatedProducts = products.slice(start, end);
    const totalProducts = products.length;

    return {
        products: paginatedProducts,
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