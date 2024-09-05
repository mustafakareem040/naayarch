'use client';
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { fetchMoreProducts } from "@/lib/api";
import dynamic from 'next/dynamic';
import { useVirtualizer } from '@tanstack/react-virtual';

const ProductItem = dynamic(() => import('./ProductItem'), { ssr: false });
const ProductLoading = dynamic(() => import("@/components/ProductLoading"));
const NoProductsFound = dynamic(() => import("@/components/NoProductsFound"));

const ITEMS_PER_PAGE = 10;

export default function ProductList({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const { ref, inView } = useInView({
        threshold: 0,
        rootMargin: '200px',
    });

    const search = useMemo(() => searchParams.get('search') || '', [searchParams]);
    const category = useMemo(() => searchParams.get('c') || '', [searchParams]);
    const subCategory = useMemo(() => searchParams.get('sc') || '', [searchParams]);

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;

        try {
            const newProducts = await fetchMoreProducts(nextPage, search, category, subCategory);
            if (newProducts.length === 0) {
                setHasMore(false);
            } else {
                setProducts(prevProducts => [...prevProducts, ...newProducts]);
                setPage(nextPage);
            }
        } catch (error) {
            console.error('Error fetching more products:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, search, category, subCategory]);

    useEffect(() => {
        if (inView) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts]);

    useEffect(() => {
        setProducts(initialProducts);
        setPage(1);
        setHasMore(true);
    }, [search, category, subCategory, initialProducts]);

    const parentRef = React.useRef();

    const columnCount = useMemo(() => {
        if (typeof window !== 'undefined') {
            if (window.innerWidth >= 1024) return 5; // lg
            if (window.innerWidth >= 768) return 4; // md
            if (window.innerWidth >= 480) return 3; // ssm3
            return 2; // default
        }
        return 2;
    }, []);

    const rowVirtualizer = useVirtualizer({
        count: Math.ceil(products.length / columnCount),
        getScrollElement: () => parentRef.current,
        estimateSize: () => 275, // Adjust based on your product item height
        overscan: 5,
        gap: 0
    });

    if (products.length === 0) {
        return <NoProductsFound />;
    }

    return (
        <div
            ref={parentRef}
            style={{
                overflow: 'auto',
                width: '100%',
            }}
        >
            <div
                style={{
                    height: `${rowVirtualizer.getTotalSize()}px`,
                    width: '100%',
                    position: 'relative',
                }}
            >
                {rowVirtualizer.getVirtualItems().map((virtualRow) => (
                    <div
                        key={virtualRow.index}
                        className="absolute top-0 left-0 w-full grid grid-cols-2 gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                        style={{
                            height: `${virtualRow.size}px`,
                            transform: `translateY(${virtualRow.start}px)`,
                        }}
                    >
                        {Array.from({ length: columnCount }).map((_, columnIndex) => {
                            const productIndex = virtualRow.index * columnCount + columnIndex;
                            const product = products[productIndex];
                            if (!product) return null;
                            return (
                                <ProductItem
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    price={formatPrice(getCheapestPrice(product))}
                                    imageUrl={`https://storage.naayiq.com/resources/${product.images[0]}` || "/placeholder.png"}
                                />
                            );
                        })}
                    </div>
                ))}
            </div>

        </div>
    );
}



const getCheapestPrice = (product) => {
    const prices = [
        product.price !== "0.00" ? product.price : Math.infinity,
        ...(product.sizes?.map(size => size.price) || []),
        ...(product.colors?.flatMap(color => [
            color.price,
            ...(color.sizes?.map(size => (size.price !== 0 && size.price)) || [])
        ]) || [])
    ].filter(Boolean).map(price => parseFloat(price.toString().replace(/[^\d.]/g, '')));

    return prices.length > 0 ? Math.min(...prices) : null;
}

const formatPrice = (price) => {
    if (price == null) return 'N/A';
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
}