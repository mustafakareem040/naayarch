
import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

export const runtime = 'edge';
const ITEMS_PER_PAGE = 15;
export const revalidate = 14400
const REVALIDATE_SUBBRANDS = 14400;
const REVALIDATE_PRODUCTS = 14400;

const fetchSubBrands = async () => {
    const response = await fetch('https://api.naayiq.com/subcategories/brands', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache', // Use 'force-cache' to leverage Data Cache
        next: { revalidate: REVALIDATE_SUBBRANDS }, // Revalidate every 60 seconds
    });

    if (response.status === 200) {
        return response.json();
    }
    throw new Error(`Failed to fetch sub-brands: ${response.statusText}`);
};

const fetchProducts = async () => {
    const response = await fetch('https://api.naayiq.com/products', {
        headers: { 'Content-Type': 'application/json' },
        cache: 'force-cache', // Use 'force-cache' to leverage Data Cache
        next: { revalidate: REVALIDATE_PRODUCTS }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

const getFilteredProducts = async (page = 1, query = '', c = '', sc = '', b = '') => {
    let [products, subBrands] = await Promise.all([
        fetchProducts(),
        b ? fetchSubBrands() : Promise.resolve([]), // Return an empty array if no sub-brands needed
    ]);
    products = products.products

    const subCategories = b
        ? subBrands
            .filter((item) => item.category_id.toString() === b)
            .map((item) => item.id.toString())
        : [];

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
            !subCategories.includes(product?.brand_id.toString())
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

    // Apply the filter
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
};

// The main ProductsPage component
const ProductsPage = async ({ searchParams }) => {
    const page = parseInt(searchParams.page) || 1;
    const query = searchParams.query || '';
    const c = searchParams.c || '';
    const sc = searchParams.sc || '';
    const b = searchParams.b || '';

    try {
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
    } catch (error) {
        return <div>Error: {error.message}</div>;
    }
};

export default ProductsPage;