import React, { useMemo } from 'react';
import ProductItem from "@/components/ProductItem";

const ProductsList = ({ products }) => {
    const getCheapestPrice = (product) => {
        let prices = [];

        if (product.price) prices.push(product.price);
        if (product.sizes) prices = prices.concat(product.sizes.map(size => size.price).filter(Boolean));
        if (product.colors) {
            prices = prices.concat(product.colors.map(color => color.price).filter(Boolean));
            product.colors.forEach(color => {
                if (color.sizes) {
                    prices = prices.concat(color.sizes.map(size => size.price).filter(Boolean));
                }
            });
        }

        const validPrices = prices
            .map(price => {
                const cleaned = price.toString().replace(/[^\d.]/g, '');
                return parseFloat(cleaned);
            })
            .filter(price => !isNaN(price) && isFinite(price));

        return validPrices.length > 0 ? Math.min(...validPrices) : null;
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'N/A';
        return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
    };

    const memoizedProducts = useMemo(() => products.map((product) => {
        const cheapestPrice = getCheapestPrice(product);
        return {
            id: product.id,
            name: product.name,
            price: formatPrice(cheapestPrice),
            imageUrl: `https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"
        };
    }), [products]);

    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {memoizedProducts.map((product) => (
                <ProductItem
                    key={product.id}
                    title={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                />
            ))}
        </div>
    );
};

export default ProductsList;