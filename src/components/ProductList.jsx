'use client';
import { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import ProductItem from './ProductItem';
import { useSearchParams } from 'next/navigation';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { fetchMoreProducts } from "@/lib/api";
import ProductLoading from "@/components/ProductLoading";

const ITEMS_PER_PAGE = 10; // Adjust based on your API's page size

export default function ProductList({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();
    const prevSearchRef = useRef('');
    const gridRef = useRef();

    const loadMoreProducts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        const nextPage = page + 1;
        const search = searchParams.get('search') || '';
        const category = searchParams.get('c') || '';
        const subCategory = searchParams.get('sc') || '';

        try {
            const newProducts = await fetchMoreProducts(nextPage, search, category, subCategory);
            if (newProducts.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }
            setProducts(prevProducts => [...prevProducts, ...newProducts]);
            setPage(nextPage);
        } catch (error) {
            console.error('Error fetching more products:', error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, page, searchParams]);

    useEffect(() => {
        const currentSearch = searchParams.get('search') || '';
        if (currentSearch !== prevSearchRef.current) {
            setProducts(initialProducts);
            setPage(1);
            setHasMore(true);
            prevSearchRef.current = currentSearch;
        }
    }, [searchParams, initialProducts]);

    const memoizedProducts = useMemo(() => products.map((product) => ({
        ...product,
        cheapestPrice: getCheapestPrice(product),
    })), [products]);

    const onItemsRendered = useCallback(({ visibleRowStopIndex }) => {
        if (visibleRowStopIndex > products.length - 10 && !loading && hasMore) {
            loadMoreProducts();
        }
    }, [loadMoreProducts, products.length, loading, hasMore]);

    if (memoizedProducts.length === 0) {
        return <div className="text-center font-serif text-red-700">No products found.</div>;
    }

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * 5 + columnIndex;
        if (index >= memoizedProducts.length) return null;
        const product = memoizedProducts[index];
        return (
            <div style={style}>
                <ProductItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={formatPrice(product.cheapestPrice)}
                    imageUrl={`https://storage.naayiq.com/resources/${product.images[0]}` || "/placeholder.png"}
                />
            </div>
        );
    };

    return (
        <>
            <AutoSizer>
                {({ height, width }) => (
                    <Grid
                        ref={gridRef}
                        className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5"
                        columnCount={5}
                        columnWidth={width / 5}
                        height={height}
                        rowCount={Math.ceil(memoizedProducts.length / 5)}
                        rowHeight={300} // Adjust based on your item height
                        width={width}
                        onItemsRendered={onItemsRendered}
                    >
                        {Cell}
                    </Grid>
                )}
            </AutoSizer>
            {loading && <ProductLoading />}
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