'use client';
import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from 'next/dynamic';
import ProductItem from './ProductItem';
import ProductLoading from '@/components/ProductLoading';
import NoProductsFound from '@/components/NoProductsFound';
import Link from 'next/link';
import Image from 'next/image';

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />,
});

export default function ProductList({
                                        initialProducts,
                                        hasMore,
                                        initialPage,
                                        initialQuery,
                                    }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(initialPage);
    const [loading, setLoading] = useState(false);
    const [noMoreProducts, setNoMoreProducts] = useState(!hasMore);
    const [query, setQuery] = useState(initialQuery);
    const { ref, inView } = useInView({
        threshold: 0,
    });
    const router = useRouter();
    const searchParams = useSearchParams();

    const loadMoreProducts = useCallback(() => {
        if (loading || noMoreProducts) return;

        setLoading(true);
        const nextPage = page + 1;
        const params = new URLSearchParams(Array.from(searchParams.entries()));
        params.set('page', nextPage.toString());
        router.replace(`/products?${params.toString()}`, { scroll: false });
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
            router.replace(`/products?${params.toString()}`, { scroll: false });
        },
        [searchParams, router]
    );

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

    const handleProductClick = useCallback(
        (product) => {
            router.push(`/products/${product.id}`, { shallow: true });
        },
        [router]
    );

    return (
        <>
            <header className="flex items-center mb-6">
                <Link prefetch={false} className="relative z-20" href={'/'}>
                    <Image
                        src="https://storage.naayiq.com/resources/arrow-left.svg"
                        width={40}
                        unoptimized={true}
                        height={40}
                        alt="left"
                        priority
                    />
                </Link>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Products
                </h1>
            </header>
            <SearchComponent query={query} setQuery={handleSearch} />
            {memoizedProducts.length > 0 ? (
                <>
                    <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                        {memoizedProducts.map((product) => (
                            <ProductItem
                                key={product.id}
                                id={product.id}
                                name={product.name}
                                product={product}
                                handleClick={() => handleProductClick(product)}
                                price={formatPrice(product.cheapestPrice)}
                                imageUrl={product.images[0]}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <NoProductsFound />
            )}
            {loading && <ProductLoading />}
            {!loading && !noMoreProducts && (
                <div ref={ref} style={{ height: '20px' }}></div>
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
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
};

const SearchComponentSkeleton = () => (
    <div className="flex mb-4 items-center space-x-2 animate-pulse">
        <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
        <div className="h-10 w-[5.5rem] bg-gray-200 rounded-md"></div>
    </div>
);