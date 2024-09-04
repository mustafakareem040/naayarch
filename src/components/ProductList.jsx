'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import ProductItem from './ProductItem';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import {fetchMoreProducts} from "@/lib/api";

export default function ProductList({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const prevSearchRef = useRef('');

    const { ref, inView } = useInView({
        threshold: 0,
    });

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;
        const search = searchParams.get('search') || '';
        const category = searchParams.get('c') || '';
        const subCategory = searchParams.get('sc') || '';

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
    }, [loading, hasMore, page, searchParams]);

    useEffect(() => {
        if (inView) {
            loadMoreProducts();
        }
    }, [inView, loadMoreProducts]);

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (currentSearch !== prevSearchRef.current) {
            setProducts(initialProducts);
            setPage(1);
            setHasMore(true);
            prevSearchRef.current = currentSearch;
        }
    }, [searchParams, initialProducts]);

    if (products.length === 0) {
        return <div className="text-center font-serif text-red-700">No products found.</div>;
    }

    return (
        <>
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
            {loading && <div className="text-center mt-4">Loading more products...</div>}
            <div ref={ref} style={{ height: '20px' }} />
        </>
    );
}


function getCheapestPrice(product) {
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

function formatPrice(price) {
    if (price == null) return 'N/A';
    return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
}



