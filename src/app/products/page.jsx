import React from 'react';
import { unstable_cache } from 'next/cache';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const revalidate = 84600; // Revalidate every day
export const runtime = 'edge';
const ITEMS_PER_PAGE = 15;

const cachedFetchSubBrands = unstable_cache(
    async () => {
        const response = await fetch(
            'https://api.naayiq.com/subcategories/brands',
            {
                headers: { 'Content-Type': 'application/json' },
            }
        );
        if (response.status === 200) {
            return await response.json();
        }
        throw new Error(response.statusText);
    },
    ['sub-brands'],
    { revalidate: 84600 }
);

const cachedFetchProducts = unstable_cache(
    async () => {
        const response = await fetch('https://api.naayiq.com/products', {
            headers: { 'Content-Type': 'application/json' },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },
    ['products'],
    { revalidate: 84600 }
);

async function getFilteredProducts(
    page = 1,
    query = '',
    c = '',
    sc = '',
    b = ''
) {
    const [{ products }, subBrands] = await Promise.all([
        cachedFetchProducts(),
        b ? cachedFetchSubBrands() : [{}],
    ]);

    const subCategories = b
        ? subBrands
            .filter((item) => item.category_id.toString() === b)
            .map((item) => item.id.toString())
        : null;

    const filterProduct = (product) => {
        if (
            c &&
            !product.categories.some(
                (cat) => cat.main_category_id?.toString() === c
            )
        )
            return false;
        if (
            sc &&
            product?.brand_id.toString() !== sc &&
            !product.categories.some((cat) => cat.id?.toString() === sc)
        )
            return false;
        if (
            b &&
            !subCategories.some((b_id) => b_id === product?.brand_id.toString())
        )
            return false;
        if (query) {
            const normalizedName = product.name
                .normalize('NFC')
                .toLowerCase();
            const cleanName = normalizedName.replace(
                /[\u200E\u200F\u202A-\u202E\u2066-\u2069]/g,
                ''
            );
            const queryWords = query.toLowerCase().split(/\s+/);
            return queryWords.every((word) => cleanName.includes(word));
        }
        return true;
    };

    let filteredProducts = products.filter(filterProduct);

    if (query) {
        const lowerQuery = query.toLowerCase();
        filteredProducts.sort((a, b) => {
            const aIndex = a.name.toLowerCase().indexOf(lowerQuery);
            const bIndex = b.name.toLowerCase().indexOf(lowerQuery);
            return (
                (aIndex === -1 ? Infinity : aIndex) -
                (bIndex === -1 ? Infinity : bIndex)
            );
        });
    }

    const totalProducts = filteredProducts.length;
    const start = 0; // Always start from the first product
    const end = page * ITEMS_PER_PAGE; // Get all products up to the current page

    return {
        products: filteredProducts.slice(start, end),
        totalProducts,
        hasMore: end < totalProducts,
    };
}

async function ProductsPage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const query = searchParams.query || '';
    const c = searchParams.c || '';
    const sc = searchParams.sc || '';
    const b = searchParams.b || '';

    const { products, totalProducts, hasMore } = await getFilteredProducts(
        page,
        query,
        c,
        sc,
        b
    );

    return (
        <>
            <AsyncNavBar />
            <ProductList
                initialProducts={products}
                totalProducts={totalProducts}
                hasMore={hasMore}
                initialPage={page}
                initialQuery={query}
                initialC={c}
                initialSc={sc}
            />
        </>
    );
}

export default ProductsPage;