'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProductItem from './ProductItem';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { fetchProducts } from "@/lib/api";
import ProductLoading from "@/components/ProductLoading";
import dynamic from "next/dynamic";
import NoProductsFound from "@/components/NoProductsFound";

const SearchComponent = dynamic(() => import('@/components/SearchComponent'),
    {ssr: false})

const ITEMS_PER_PAGE = 10;

export default function ProductList() {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(0);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("")
    const [c, setC] = useState("")
    const [sc, setSc] = useState("")
    const prevSearch = useRef("")
    const { ref, inView } = useInView({
        threshold: 0,
    });
    const [paramsLoaded, setParamsLoaded] = useState(false);

    useEffect(() => {
        setC(searchParams.get("c") || "");
        setSc(searchParams.get("sc") || "");
        setParamsLoaded(true);
    }, [searchParams]);

    const loadMoreProducts = useCallback(async () => {
        if (!paramsLoaded) return;

        let resetProducts = false;
        if (prevSearch.current !== query) {
            setPage(0);
            resetProducts = true;
            setHasMore(true);
            prevSearch.current = query;
        }

        if (loading || !hasMore) return;

        console.log('Fetching products...');
        setLoading(true);
        const nextPage = resetProducts ? 1 : page + 1;

        try {
            const newProducts = await fetchProducts(nextPage, query, c, sc);
            if (newProducts.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }
            setProducts(resetProducts ? newProducts : prevProducts => [...prevProducts, ...newProducts]);
            setPage(nextPage);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    }, [query, c, sc, page, loading, hasMore, paramsLoaded]);

    useEffect(() => {
        loadMoreProducts()
    }, [paramsLoaded, query]);

    useEffect(() => {
        if (inView && paramsLoaded) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts]);

    const memoizedProducts = useMemo(() => products.map((product) => ({
        ...product,
        cheapestPrice: getCheapestPrice(product),
    })), [products]);

    return (
        <>
            <SearchComponent query={query} setQuery={setQuery} />
            {loading && products.length === 0 ? <ProductLoading /> :
                memoizedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
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
                ) : <NoProductsFound />
            }
            {loading && products.length > 0 && <ProductLoading />}
            <div ref={ref}></div>
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