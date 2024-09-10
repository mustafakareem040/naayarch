'use client'
import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from "next/dynamic";
import ProductItem from './ProductItem';
import { fetchProducts } from "@/lib/api";
import ProductLoading from "@/components/ProductLoading";
import NoProductsFound from "@/components/NoProductsFound";
import ErrorHandler from "@/components/ErrorHandler";
import { useProducts } from './ProductsContext';

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />
});

export default function ProductList() {
    const {
        products,
        updateProducts,
        resetProducts,
        page,
        setPage,
        hasMore,
        setHasMore,
        scrollPosition,
        setScrollPosition
    } = useProducts();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(false);
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [c, setC] = useState("");
    const [sc, setSc] = useState("");
    const prevSearch = useRef("");
    const {ref, inView} = useInView({
        threshold: 0,
    });
    const [paramsLoaded, setParamsLoaded] = useState(false);
    const initialLoadDone = useRef(false);

    useEffect(() => {
        setC(searchParams.get("c") || "");
        setSc(searchParams.get("sc") || "");
        setParamsLoaded(true);
    }, [searchParams]);

    const loadMoreProducts = useCallback(async () => {
        if (!paramsLoaded || loading || !hasMore) return;

        setLoading(true);
        setError(false);

        try {
            const newProducts = await fetchProducts(page, query, c, sc);
            if (newProducts.pagination.currentPage >= newProducts.pagination.totalPages) {
                setHasMore(false);
            }
            updateProducts(newProducts.products);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching products:', error);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [query, c, sc, page, loading, hasMore, paramsLoaded, updateProducts, setPage, setHasMore]);

    const resetSearch = useCallback(() => {
        resetProducts();
        setError(false);
        prevSearch.current = query;
        initialLoadDone.current = false;
    }, [query, resetProducts]);

    useEffect(() => {
        if (paramsLoaded && !initialLoadDone.current) {
            resetSearch();
            loadMoreProducts();
            initialLoadDone.current = true;
        }
    }, [paramsLoaded, resetSearch, loadMoreProducts]);

    useEffect(() => {
        if (inView && paramsLoaded && !loading && hasMore && initialLoadDone.current) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts, paramsLoaded, loading, hasMore]);

    useEffect(() => {
        if (prevSearch.current !== query) {
            resetSearch();
        }
    }, [query, resetSearch]);

    useEffect(() => {
        const handleScroll = () => {
            setScrollPosition(window.pageYOffset);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [setScrollPosition]);

    useEffect(() => {
        if (scrollPosition > 0) {
            window.scrollTo(0, scrollPosition);
        }
    }, [scrollPosition]);

    const handleRetry = useCallback(() => {
        setError(false);
        loadMoreProducts();
    }, [loadMoreProducts]);

    return (
        <div className="overflow-x-hidden">
            <SearchComponent query={query} setQuery={setQuery}/>
            {error ? (
                <ErrorHandler onRetry={handleRetry} />
            ) : loading && products.length === 0 ? (
                <ProductLoading/>
            ) : products.length > 0 ? (
                <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {products.map((product) => (
                        <ProductItem
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={formatPrice(getCheapestPrice(product))}
                            imageUrl={`https://storage.naayiq.com/resources/${product.images[0]}` || "/placeholder.png"}
                        />
                    ))}
                </div>
            ) : !loading ? (
                <NoProductsFound/>
            ) : null}
            {loading && products.length > 0 && <ProductLoading/>}
            <div ref={ref}></div>
        </div>
    );
}



function getCheapestPrice(product) {
    const prices = [
        product.price !== "0.00" ? parseFloat(product.price) : Infinity,
        ...(product.sizes?.map(size => parseFloat(size.price)) || []),
        ...(product.colors?.flatMap(color => [
            parseFloat(color.price),
            ...(color.sizes?.map(size => (size.price !== 0 && parseFloat(size.price))) || [])
        ]) || [])
    ].filter(price => !isNaN(price) && isFinite(price));

    return prices.length > 0 ? Math.min(...prices) : null;
}

function formatPrice(price) {
    if (price == null) return 'N/A';
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
}

function SearchComponentSkeleton() {
    return (
        <div className="flex mb-4 items-center space-x-2 animate-pulse">
            <div className="h-10 bg-gray-200 rounded-md flex-grow"></div>
            <div className="h-10 w-[5.5rem] bg-gray-200 rounded-md"></div>
        </div>
    );
}