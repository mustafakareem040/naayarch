import React, { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import Loading from "@/components/Loading";
import { NotificationProvider } from "@/components/NotificationContext";
export const dynamic = 'force-dynamic';
async function fetchProduct(id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`);
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

export default async function ProductDetailsPage({params}) {
    return (
        <NotificationProvider>
            <Suspense fallback={<Loading/>}>
                <ProductContent id={await params.id}/>
            </Suspense>
        </NotificationProvider>
    );
}