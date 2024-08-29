'use client'
import { useSearchParams } from 'next/navigation';
import AsyncProducts from "@/components/AsyncProducts";
import { Suspense } from "react";

function ProductsContent() {
    const searchParams = useSearchParams();
    const c = searchParams.get('c');
    const sc = searchParams.get('sc');
    return <AsyncProducts c={c} sc={sc} />;
}

export default function ProductsPage() {
    return (
        <ProductsContent />
    );
}