import React from 'react';
import ProductItem from "@/components/ProductItem";

const ProductsList = ({ products }) => {
    const getCheapestPrice = (product) => {
        if (!product.sizes) return null;
        const prices = product.sizes
            .map(size => size.price)
            .filter(price => price !== null && price !== undefined && price !== '')
            .map(price => {
                const cleaned = price.replace(/[^\d.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                    return parseFloat(parts[0] + '.' + parts.slice(1).join(''));
                }
                return parseFloat(cleaned);
            })
            .filter(price => !isNaN(price) && isFinite(price));
        return prices.length > 0 ? Math.min(...prices) : null;
    };

    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => {
                const cheapestPrice = getCheapestPrice(product);
                return (
                    <ProductItem
                        key={product.id}
                        title={product.name}
                        price={cheapestPrice ? `${cheapestPrice} IQD` : 'N/A'}
                        imageUrl={`https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"}
                    />
                );
            })}
        </div>
    );
};

export default ProductsList;