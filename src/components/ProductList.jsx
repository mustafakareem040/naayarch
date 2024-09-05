'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { useInView } from 'react-intersection-observer';
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { fetchMoreProducts } from "@/lib/api";
import ProductItem from './ProductItem';
import SearchComponent from './SearchComponent';
import ProductLoading from "@/components/ProductLoading";
import NoProductsFound from "@/components/NoProductsFound";

const ProductList = ({ initialProducts }) => {
    const [products, setProducts] = useState(initialProducts);
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const searchParams = useSearchParams();

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

    const Cell = ({ columnIndex, rowIndex, style }) => {
        const index = rowIndex * 2 + columnIndex;
        const product = products[index];

        if (!product) return null;

        return (
            <div style={style}>
                <ProductItem
                    id={product.id}
                    name={product.name}
                    price={formatPrice(getCheapestPrice(product))}
                    imageUrl={`https://storage.naayiq.com/resources/${product.images[0]}` || "/placeholder.png"}
                />
            </div>
        );
    };

    if (products.length === 0) {
        return (
            <>
                <SearchComponent
                    setProducts={setProducts}
                    setPage={setPage}
                    setHasMore={setHasMore}
                    setLoading={setLoading}
                />
            <NoProductsFound />
                </>
        );
    }

    return (
        <>
            <SearchComponent
                setProducts={setProducts}
                setPage={setPage}
                setHasMore={setHasMore}
                setLoading={setLoading}
            />
            <AutoSizer>
                {({ height, width }) => (
                    <Grid
                        columnCount={2}
                        columnWidth={width / 2}
                        height={height}
                        rowCount={Math.ceil(products.length / 2)}
                        rowHeight={300}
                        width={width}
                    >
                        {Cell}
                    </Grid>
                )}
            </AutoSizer>
            {loading && <ProductLoading />}
            <div ref={ref} style={{ height: '20px' }} />
        </>
    );
};

export default ProductList;


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



