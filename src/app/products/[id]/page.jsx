import React, { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import Loading from "@/components/Loading";
import { NotificationProvider } from "@/components/NotificationContext";

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
            product={product}
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