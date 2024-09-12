'use client'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import dynamic from "next/dynamic";
import ProductItem from './ProductItem';
import ProductLoading from "@/components/ProductLoading";
import NoProductsFound from "@/components/NoProductsFound";
import ProductDetail from "@/components/ProductDetail";
import Link from "next/link";
import Image from "next/image";
import { NotificationProvider } from "@/components/NotificationContext";

const SearchComponent = dynamic(() => import('@/components/SearchComponent'), {
    ssr: false,
    loading: () => <SearchComponentSkeleton />
});

export default function ProductList({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const [query, setQuery] = useState("");
    const [c, setC] = useState("");
    const [first, setFirst] = useState(true)
    const [sc, setSc] = useState("");
    const { ref, inView } = useInView({
        threshold: 0,
    });
    const [shouldScroll, setShouldScroll] = useState(false);
    const scroll = useRef(0);
    const path = usePathname()
    const [detail, setDetail] = useState(null);

    useEffect(() => {
        setC(searchParams.get("c") || "");
        setSc(searchParams.get("sc") || "");
    }, [searchParams]);

    const filterProducts = useCallback(() => {
        let filtered = initialProducts;

        if (query) {
            filtered = filtered.filter(product =>
                product.name.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (c) {
            filtered = filtered.filter(product => product.category === c);
        }

        if (sc) {
            filtered = filtered.filter(product => product.subCategory === sc);
        }

        setProducts(filtered);
        setDisplayedProducts([]); // Reset displayed products
        setPage(1);
        setHasMore(true);
        setFirst(false)
    }, [initialProducts, query, c, sc]);

    useEffect(() => {
        filterProducts();
    }, [filterProducts, query, c, sc]); // Add query, c, and sc as dependencies

    const loadMoreProducts = useCallback(() => {
        if (loading || !hasMore) return;

        setLoading(true);

        const startIndex = (page - 1) * 10;
        const endIndex = startIndex + 10;
        const newProducts = products.slice(startIndex, endIndex);

        setDisplayedProducts(prev => [...prev, ...newProducts]);
        setPage(prev => prev + 1);
        setHasMore(endIndex < products.length);
        setLoading(false);
    }, [products, page, loading, hasMore]);

    useEffect(() => {
        if (inView && hasMore) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts, hasMore]);

    const memoizedProducts = useMemo(() => displayedProducts.map((product) => ({
        ...product,
        cheapestPrice: getCheapestPrice(product),
    })), [displayedProducts]);

    useEffect(() => {
        const handlePopState = () => {
            setShouldScroll(true);
        };
        window.addEventListener('popstate', handlePopState);

        return () => {
            window.removeEventListener('popstate', handlePopState);
        };
    }, []);

    useEffect(() => {
        if (shouldScroll) {
            window.scrollTo(0, scroll.current)
            setShouldScroll(false);
        }
    }, [shouldScroll]);

    useEffect(() => {
        if (path.length <= 10) {
            setDetail(null);
            setShouldScroll(true)
        }
    }, [path]);

    return (
        <>
            {detail ? (
                <NotificationProvider>
                    <ProductDetail product={detail}/>
                </NotificationProvider>
            ) : (
                <>
                    <header className="flex items-center mb-6">
                        <Link prefetch={false} className="relative z-20" href={"/"}>
                            <Image src="https://storage.naayiq.com/resources/arrow-left.svg" width={40}
                                   unoptimized={true} height={40} alt="left" priority/>
                        </Link>
                        <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
                    </header>
                    <SearchComponent query={query} setQuery={setQuery}/>
                    {memoizedProducts.length > 0 ? (
                        <>
                            <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                                {memoizedProducts.map((product) => (
                                    <ProductItem
                                        key={product.id}
                                        id={product.id}
                                        name={product.name}
                                        product={product}
                                        handleClick={() => {
                                            scroll.current = window.scrollY
                                            setDetail(product)
                                            const newURL = `/products/${product.id}`;
                                            window.history.pushState({ path: newURL }, '', newURL);
                                        }}
                                        price={formatPrice(product.cheapestPrice)}
                                        imageUrl={product.images[0]}
                                    />
                                ))}
                            </div>
                        </>
                    ) : !loading && !first ? (
                        <NoProductsFound/>
                    ) : null}
                    {(loading || first) && <ProductLoading/>}
                    {(!loading || first) && hasMore && <div ref={ref} style={{height: '15px'}}></div>}
                </>
            )}
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