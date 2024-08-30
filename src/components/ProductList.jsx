'use client';

import { useState, useEffect } from 'react';
import ProductItem from './ProductItem';
import { useSearchParams } from 'next/navigation';
import { fetchProducts } from '@/lib/api';

export default function ProductList({ initialProducts }) {
    const [products, setProducts] = useState(initialProducts);
    const searchParams = useSearchParams();

    useEffect(() => {
        const page = searchParams.get('page') || '1';
        const search = searchParams.get('search') || '';
        const category = searchParams.get('c') || '';
        const subCategory = searchParams.get('sc') || '';

        fetchProducts(page, search, category, subCategory)
            .then(({ products }) => setProducts(products))
            .catch(error => console.error('Error fetching products:', error));
    }, [searchParams]);

    if (products.length === 0) {
        return <div className="text-center font-serif text-red-700">No products found.</div>;
    }

    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    id={product.id}
                    name={product.name}
                    price={formatPrice(getCheapestPrice(product))}
                    imageUrl={`https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"}
                />
            ))}
        </div>
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