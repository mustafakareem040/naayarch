import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';
import { unstable_cache } from 'next/cache';
import Link from 'next/link';

const ITEMS_PER_PAGE = 15;
export const revalidate = 14400; // 4 hours

const REVALIDATE_SUBBRANDS = 14400; // 4 hours
const REVALIDATE_PRODUCTS = 14400; // 4 hours

// Wrap fetchSubBrands with unstable_cache
const fetchSubBrands = unstable_cache(
    async () => {
        const response = await fetch('https://api.naayiq.com/subcategories/brands', {
            headers: { 'Content-Type': 'application/json' },
            cache: "force-cache",
            next: {revalidate: REVALIDATE_SUBBRANDS}
        });

        if (response.status === 200) {
            return response.json();
        }
        throw new Error(`Failed to fetch sub-brands: ${response.statusText}`);
    },
    {
        revalidate: REVALIDATE_SUBBRANDS,
    }
);

// Wrap fetchProducts with unstable_cache
const fetchProducts = unstable_cache(
    async () => {
        const response = await fetch('https://api.naayiq.com/products', {
            headers: { 'Content-Type': 'application/json' },
            cache: "force-cache",
            next: {revalidate: REVALIDATE_PRODUCTS}
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        return response.json();
    },
    {
        revalidate: REVALIDATE_PRODUCTS,
    }
);

// Cache getFilteredProducts to ensure it's only processed once per request
const getFilteredProducts = unstable_cache(async (
    page = 1,
    query = '',
    c = '',
    sc = '',
    b = '',
    minPriceA = 0,
    maxPriceA = Infinity,
    availability = 'all',
    sortBy = ''
) => {
    const [productsData, subBrands] = await Promise.all([
        fetchProducts(), // Uses unstable_cache: fetched once every 4 hours
        b ? fetchSubBrands() : Promise.resolve([]), // Uses unstable_cache: fetched once every 4 hours if 'b' is truthy
    ]);

    let products = productsData.products;

    const subCategories = b
        ? subBrands
            .filter((item) => item.category_id.toString() === b)
            .map((item) => item.id.toString())
        : [];

    // Calculate min and max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    products.forEach((product) => {
        product.sizes.forEach((size) => {
            const price = parseFloat(size.price);
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
        });
    });

    const filterProduct = (product) => {
        if (
            c &&
            !product.categories.some((cat) => cat.main_category_id?.toString() === c)
        )
            return false;
        if (
            sc &&
            product?.brand_id.toString() !== sc &&
            !product.categories.some((cat) => cat.id?.toString() === sc)
        )
            return false;
        if (b && !subCategories.includes(product?.brand_id.toString())) return false;

        // Price range filter
        const productPrices = product.sizes.map((size) => parseFloat(size.price));
        const productMinPrice = Math.min(...productPrices);
        const productMaxPrice = Math.max(...productPrices);

        if (productMinPrice < minPriceA || productMaxPrice > maxPriceA) {
            return false;
        }

        // Availability filter
        if (availability !== 'all') {
            const inStock = product.sizes.some((size) => size.qty > 0);
            if (
                (availability === 'in_stock' && !inStock) ||
                (availability === 'out_of_stock' && inStock)
            ) {
                return false;
            }
        }

        // Query filter
        if (query) {
            const normalizedName = product.name.normalize('NFC').toLowerCase();
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

    // Calculate total sold for each product
    filteredProducts.forEach((product) => {
        product.totalSold = product.sizes.reduce((sum, size) => sum + size.sold, 0);
    });

    // Apply sorting
    switch (sortBy) {
        case 'Price: Low to High':
            filteredProducts.sort(
                (a, b) =>
                    Math.min(...a.sizes.map((s) => parseFloat(s.price))) -
                    Math.min(...b.sizes.map((s) => parseFloat(s.price)))
            );
            break;
        case 'Price: High to Low':
            filteredProducts.sort(
                (a, b) =>
                    Math.max(...b.sizes.map((s) => parseFloat(s.price))) -
                    Math.max(...a.sizes.map((s) => parseFloat(s.price)))
            );
            break;
        case 'Name: A to Z':
            filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
        case 'Name: Z to A':
            filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
        case 'Best Selling':
            filteredProducts.sort((a, b) => b.totalSold - a.totalSold);
            break;
        case 'Newest Arrivals':
            filteredProducts.sort(
                (a, b) => new Date(b.created_at) - new Date(a.created_at)
            );
            break;
        default:
            // Default sorting (optional)
            break;
    }

    // Additional query-based sorting if applicable
    if (query && !sortBy) {
        const lowerQuery = query.toLowerCase();
        filteredProducts.sort((a, b) => {
            const aIndex = a.name.toLowerCase().indexOf(lowerQuery);
            const bIndex = b.name.toLowerCase().indexOf(lowerQuery);
            return (aIndex === -1 ? Infinity : aIndex) - (bIndex === -1 ? Infinity : bIndex);
        });
    }

    const totalProducts = filteredProducts.length;
    const end = page * ITEMS_PER_PAGE;

    return {
        products: filteredProducts.slice(0, end),
        totalProducts,
        hasMore: end < totalProducts,
        minPrice,
        maxPrice,
    };
}, {revalidate: 84000});

// The main ProductsPage component
const ProductsPage = async ({ searchParams }) => {
    // Destructure and parse search parameters
    const {
        page = '1',
        query = '',
        c = '',
        sc = '',
        b = '',
        minPrice = '0',
        maxPrice = '',
        availability = 'all',
        sortBy = '',
        title = '',
    } = searchParams;

    const pageNum = parseInt(page, 10) || 1;
    const minPriceNum = parseFloat(minPrice) || 0;
    const maxPriceNum = maxPrice ? parseFloat(maxPrice) : Infinity;

    try {
        // Get filtered products based on search parameters
        const { products, totalProducts, hasMore, minPrice, maxPrice } = await getFilteredProducts(
            pageNum,
            query,
            c,
            sc,
            b,
            minPriceNum,
            maxPriceNum,
            availability,
            sortBy
        );

        return (
            <>
                <AsyncNavBar />
                <ProductList
                    initialProducts={products}
                    totalProducts={totalProducts}
                    hasMore={hasMore}
                    initialPage={pageNum}
                    initialQuery={query}
                    initialC={c}
                    initialSc={sc}
                    initialB={b}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    title={sortBy || title || 'All Products'}
                />
            </>
        );
    } catch (error) {
        // Enhanced error handling with user-friendly message
        console.error('Error fetching products:', error);
        return (
            <div className="font-serif flex flex-col justify-center items-center p-4">
                <p>Oops! Something went wrong while loading products. Please try again later.</p>
                <Link href="/" className="text-blue-500 underline mt-2">
                    Go back home
                </Link>
            </div>
        );
    }
};

export default ProductsPage;