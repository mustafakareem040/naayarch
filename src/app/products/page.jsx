'use client'
import { useSearchParams } from 'next/navigation';
import AsyncProducts from "@/components/AsyncProducts";

export const experimental_ppr = true

export default function ProductsPage() {
    const searchParams = useSearchParams();

    const c = searchParams.get('c');
    const sc = searchParams.get('sc');

    return <AsyncProducts c={c} sc={sc} />
}