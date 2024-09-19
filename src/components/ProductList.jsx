'use client'
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link'; // Import Link
import { useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import ProductItem from './ProductItem';
import ProductLoading from '@/components/ProductLoading';
import NoProductsFound from '@/components/NoProductsFound';
import { usePathname } from 'next/navigation';
import Loading from "./Loading"
import { NotificationProvider } from "@/components/NotificationContext";

// Dynamically import the SearchComponent
const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />,
});

// Dynamically import the ProductModal
const ProductModal = dynamic(() => import("@/components/ProductDetailModal"), {
    ssr: false
});

export default function ProductList({
                                        initialProducts,
                                        hasMore,
                                        initialPage,
                                        initialQuery,
                                        minPrice,
                                        maxPrice,
                                        title
                                    }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [noMoreProducts, setNoMoreProducts] = useState(!hasMore);
    const [query, setQuery] = useState(initialQuery);
    // Remove isNavigating state
    // const [isNavigating, setIsNavigating] = useState(false);

    // New State: Manage the selected product for the modal
    const [selectedProduct, setSelectedProduct] = useState(null);

    const { ref, inView } = useInView({ threshold: 0 });
    const router = useRouter();
    const searchParams = useSearchParams();
    const pathname = usePathname();

    const loadMoreProducts = useCallback(() => {
        if (loading || noMoreProducts) return;

        setLoading(true);
        const nextPage = page + 1;
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set('page', nextPage.toString());
        router.push(`/products?${params.toString()}`); // Fixed: Added backticks for template literal
    }, [page, loading, noMoreProducts, searchParams, router]);

    useEffect(() => {
        if (inView && !noMoreProducts) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts, noMoreProducts]);

    const handleSearch = useCallback(
        (newQuery) => {
            setQuery(newQuery);
            const params = new URLSearchParams(Array.from(searchParams.entries()));
            params.set('query', newQuery);
            params.set('page', '1');
            router.push(`/products?${params.toString()}`); // Fixed: Added backticks for template literal
        },
        [searchParams, router]
    )

    useEffect(() => {
        setProducts(initialProducts);
        setPage(initialPage);
        setNoMoreProducts(!hasMore);
        setQuery(initialQuery);
        setLoading(false);
    }, [initialProducts, initialPage, hasMore, initialQuery]);

    const memoizedProducts = useMemo(
        () =>
            products.map((product) => ({
                ...product,
                cheapestPrice: getCheapestPrice(product),
            })),
        [products]
    );

    // Removed handleProductClick
    // const handleProductClick = useCallback(
    //     (product) => {
    //         setIsNavigating(true);
    //         router.push(/products/${product.id}, { shallow: true });
    //     },
    //     [router]
    // );

    // New Handler: Handle cart button click to open modal
    const handleCartClick = useCallback(
        (product) => {
            setSelectedProduct(product);
        },
        []
    );

    // New Handler: Close the modal
    const handleModalClose = useCallback(() => {
        setSelectedProduct(null);
    }, []);

    useEffect(() => {
        // This effect will run when the pathname changes
        // Removed setIsNavigating
    }, [pathname]);

    // Removed conditional rendering based on isNavigating
    // if (isNavigating) {
    //     return <Loading />
    // }

    return (
        <>
            <header className="flex mt-24 justify-center items-center mb-8 relative">
                <h1
                    className="text-3xl z-10 text-[#181717] font-sans text-center font-medium">
                    {title || 'All Products'}
                </h1>
            </header>
            <SearchComponent minPrice={minPrice} maxPrice={maxPrice} query={query} setQuery={handleSearch} />
            {memoizedProducts.length > 0 ? (
                <div
                    className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {memoizedProducts.map((product) => (
                        <div
                            key={product.id}
                            className="cursor-pointer"
                        >
                            <Link href={`/products/${product.id}`} className="block"> {/* Fixed: Added backticks for template literal */}
                                <ProductItem
                                    id={product.id}
                                    name={product.name}
                                    product={product}
                                    price={formatPrice(product.cheapestPrice)}
                                    imageUrl={product.images[0]}
                                    onCartClick={handleCartClick} // Pass the handler
                                />
                            </Link>
                        </div>
                    ))}
                </div>
            ) : (
                <NoProductsFound />
            )}
            {loading && <ProductLoading />}
            {!loading && !noMoreProducts && (
                <div ref={ref} style={{ height: '20px' }}></div>
            )}
            {/* Render Modal Here */}
            {selectedProduct && (
                <NotificationProvider>
                    <ProductModal
                        productData={{ product: selectedProduct }}
                        isOpen={!!selectedProduct}
                        onClose={handleModalClose}
                    />
                </NotificationProvider>
            )}
        </>
    );
}

const getCheapestPrice = (product) => {
    const prices = [
        product.price && product.price !== '0.00'
            ? parseFloat(product.price)
            : Infinity,
        ...(product.sizes?.map((size) => parseFloat(size.price)) || []),
        ...(product.colors?.flatMap((color) => [
            parseFloat(color.price),
            ...(color.sizes?.map((size) => parseFloat(size.price)) || []),
        ]) || []),
    ].filter((price) => !isNaN(price) && isFinite(price));

    return prices.length > 0 ? Math.min(...prices) : null;
};

const formatPrice = (price) => {
    if (price == null || price === Infinity) return 'N/A';
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`; // Fixed: Used backticks for template literal and corrected the conditional formatting
};

const SearchComponentSkeleton = () => (
    <div className="flex mb-4 items-center space-x-2 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
        <div className="h-10 w-[5.5rem] bg-gray-200 rounded-md"></div>
    </div>
);