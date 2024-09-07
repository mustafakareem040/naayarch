import React, { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import Loading from "@/components/Loading";
import { NotificationProvider } from "@/components/NotificationContext";

export const experimental_ppr = true;

async function fetchProduct(id) {
    const response = await fetch(`https://api.naayiq.com/products/${id}`, {cache: "force-cache"});
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

async function ProductContent({ id }) {
    const { product } = await fetchProduct(id);

    return (
        <ProductDetail
            images={product.images?.map((image) => `https://storage.naayiq.com/resources/${image.url}`)}
            sizeNames={product.sizes?.map((size) => size.name)}
            sizePrices={product.sizes?.map((size) => size.price)}
            sizeQuantities={product.sizes?.map((size) => size.qty)}
            colorNames={product.colors?.map((color) => color.name)}
            colorPrices={product.colors?.map((color) => color.price)}
            colorQuantities={product.colors?.map((color) => color.qty)}
            colorImages={product.colors?.map((color) => color.images[0] ? `https://storage.naayiq.com/resources/${color.images[0]}` : null)}
            title={product.name}
            description={product.description.replace(/\n/g, '<br />')}
            price={product.price ?? product.sizes[0]?.price ?? "N/A"}
        />
    );
}

export default function ProductDetailsPage({ params }) {
    return (
        <NotificationProvider>
            <Suspense fallback={<Loading />}>
                <ProductContent id={params.id} />
            </Suspense>
        </NotificationProvider>
    );
}