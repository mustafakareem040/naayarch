import React from 'react';
import ProductItem from "@/components/ProductItem";

const ProductsList = ({ products }) => {
    return (
        <div className="grid grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {products.map((product) => (
                <ProductItem
                    key={product.id}
                    title={product.name}
                    price={`${product.price} IQD`}
                    imageUrl={`https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"}
                />
            ))}
        </div>
    );
};

export default ProductsList;