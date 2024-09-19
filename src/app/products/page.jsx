
import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';

const ITEMS_PER_PAGE = 15;
export const revalidate = 14400
const REVALIDATE_SUBBRANDS = 14400;
const REVALIDATE_PRODUCTS = 14400;

const fetchSubBrands = async () => {
    const response = await fetch('https://api.naayiq.com/subcategories/brands', {
        headers: { 'Content-Type': 'application/json' },
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
        next: { revalidate: REVALIDATE_PRODUCTS }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
        throw new Error('Failed to fetch products');
    }
    return response.json();
};

const getFilteredProducts = async (page = 1, query = '', c = '', sc = '', b = '', minPriceA = 0, maxPriceA = Infinity, availability = 'all', sortBy = '') => {
    let [products, subBrands] = await Promise.all([
        fetchProducts(),
        b ? fetchSubBrands() : Promise.resolve([]),
    ]);
    products = products.products;

    const subCategories = b
        ? subBrands
            .filter((item) => item.category_id.toString() === b)
            .map((item) => item.id.toString())
        : [];

    // Calculate min and max prices
    let minPrice = Infinity;
    let maxPrice = -Infinity;
    products.forEach(product => {
        product.sizes.forEach(size => {
            const price = parseFloat(size.price);
            if (price < minPrice) minPrice = price;
            if (price > maxPrice) maxPrice = price;
        });
    });

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

        // Price range filter
            const productPrices = product.sizes.map(size => parseFloat(size.price));
            const productMinPrice = Math.min(...productPrices);
            const productMaxPrice = Math.max(...productPrices);

            if (productMinPrice < minPriceA || productMaxPrice > maxPriceA) {
                return false;
            }
        if (availability !== 'all') {
            const inStock = product.sizes.some(size => size.qty > 0);
            if ((availability === 'in_stock' && !inStock) || (availability === 'out_of_stock' && inStock)) {
                return false;
            }
        }

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

    // Calculate total sold for each product
    filteredProducts.forEach(product => {
        product.totalSold = product.sizes.reduce((sum, size) => sum + size.sold, 0);
    });

    // Apply sorting
    switch (sortBy) {
        case 'Price: Low to High':
            filteredProducts.sort((a, b) => Math.min(...a.sizes.map(s => parseFloat(s.price))) - Math.min(...b.sizes.map(s => parseFloat(s.price))));
            break;
        case 'Price: High to Low':
            filteredProducts.sort((a, b) => Math.max(...b.sizes.map(s => parseFloat(s.price))) - Math.max(...a.sizes.map(s => parseFloat(s.price))));
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
            filteredProducts.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
            break;
        default:
            // Default sorting (you can choose any default sorting method)
            break;
    }

    if (query && !sortBy) {
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
    const start = 0;
    const end = page * ITEMS_PER_PAGE;

    return {
        products: filteredProducts.slice(start, end),
        totalProducts,
        hasMore: end < totalProducts,
        minPrice,
        maxPrice,
    };
};

// The main ProductsPage component
const ProductsPage = async ({ searchParams }) => {
    const page = parseInt(searchParams.page) || 1;
    const query = searchParams.query || '';
    const c = searchParams.c || '';
    const sc = searchParams.sc || '';
    const b = searchParams.b || '';
    const minPriceF = searchParams.minPrice
    const maxPriceF = searchParams.maxPrice
    const availability = searchParams.availability || 'all';
    const sortBy = searchParams.sortBy || '';
    const title = searchParams.title || '';

    try {
        const { products, totalProducts, hasMore, minPrice, maxPrice } = await getFilteredProducts(
            page,
            query,
            c,
            sc,
            b,
            minPriceF,
            maxPriceF,
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
                    initialPage={page}
                    initialQuery={query}
                    initialC={c}
                    initialSc={sc}
                    initialB={b}
                    minPrice={minPrice}
                    maxPrice={maxPrice}
                    title={sortBy || title || "All Products"}
                />
            </>
        );
    } catch (error) {
        return <div>Error: {error.message}</div>;
    }
};

export default ProductsPage;