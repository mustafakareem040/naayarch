'use client'
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from "next/dynamic";
import ProductItem from './ProductItem';
import { fetchProducts } from "@/lib/api";
import ProductLoading from "@/components/ProductLoading";
import NoProductsFound from "@/components/NoProductsFound";

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />
});


export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [hasMore, setHasMore] = useState(true);
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

        try {
            const newProducts = await fetchProducts(page, query, c, sc);
            if (newProducts.pagination.currentPage >= newProducts.pagination.totalPages) {
                setHasMore(false);
            }
            setProducts(prev => [...prev, ...newProducts.products]);
            setPage(prev => prev + 1);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [query, c, sc, page, loading, hasMore, paramsLoaded]);

    const resetSearch = useCallback(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
        prevSearch.current = query;
        initialLoadDone.current = false;
    }, [query]);

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

    const memoizedProducts = useMemo(() => products.map((product) => ({
        ...product,
        cheapestPrice: getCheapestPrice(product),
    })), [products]);

    return (
        <>
            <SearchComponent query={query} setQuery={setQuery}/>
            {loading ? (
                <ProductLoading/>
            ) : memoizedProducts.length > 0 ? (
                <div
                    className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                    {memoizedProducts.map((product) => (
                        <ProductItem
                            key={product.id}
                            id={product.id}
                            name={product.name}
                            price={formatPrice(product.cheapestPrice)}
                            imageUrl={`https://storage.naayiq.com/resources/${product.images[0]}` || "/placeholder.png"}
                        />
                    ))}
                </div>
            ) : !loading && products.length === 0 ? (
                <NoProductsFound/>
            ) : null}
        </>
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