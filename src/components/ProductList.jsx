import React from 'react';
import ProductItem from "@/components/ProductItem";

const ProductsList = ({ products }) => {
    const getCheapestPrice = (product) => {
        let prices = [];

        // Check product price
        if (product.price) {
            prices.push(product.price);
        }

        // Check sizes prices
        if (product.sizes) {
            prices = prices.concat(product.sizes.map(size => size.price).filter(Boolean));
        }

        // Check colors prices
        if (product.colors) {
            prices = prices.concat(product.colors.map(color => color.price).filter(Boolean));

            // Check color-sizes prices
            product.colors.forEach(color => {
                if (color.sizes) {
                    prices = prices.concat(color.sizes.map(size => size.price).filter(Boolean));
                }
            });
        }

        // Clean and parse prices
        const validPrices = prices
            .map(price => {
                const cleaned = price.toString().replace(/[^\d.]/g, '');
                const parts = cleaned.split('.');
                if (parts.length > 2) {
                    return parseFloat(parts[0] + '.' + parts.slice(1).join(''));
                }
                return parseFloat(cleaned);
            })
            .filter(price => !isNaN(price) && isFinite(price));

        return validPrices.length > 0 ? Math.min(...validPrices) : null;
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'N/A';
        const formattedPrice = price >= 10000 ? price.toLocaleString() : price;
        return `${formattedPrice} IQD`;
    };

    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => {
                const cheapestPrice = getCheapestPrice(product);
                return (
                    <ProductItem
                        key={product.id}
                        title={product.name}
                        price={formatPrice(cheapestPrice)}
                        imageUrl={`https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"}
                    />
                );
            })}
        </div>
    );
};

export default ProductsList;