import React, { useMemo } from 'react';
import ProductItem from "@/components/ProductItem";

const ProductsList = React.memo(({ products }) => {
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
    };

    const formatPrice = (price) => {
        if (price == null) return 'N/A';
        return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
    };

    const memoizedProducts = useMemo(() => products.map((product) => ({
        id: product.id,
        name: product.name,
        price: formatPrice(getCheapestPrice(product)),
        imageUrl: `https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"
    })), [products]);
    console.log('called!')
    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {memoizedProducts.map((product) => (
                <ProductItem
                    key={product.id}
                    {...product}
                />
            ))}
        </div>
    );
});

ProductsList.displayName = 'ProductsList';
export default ProductsList;
