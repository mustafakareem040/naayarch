'use client'
import { useSearchParams } from 'next/navigation';
import AsyncProducts from "@/components/AsyncProducts";
import {Suspense, useEffect, useState} from "react";




export default function ProductsPage() {
    const [c, setC] = useState(null);
    const [sc, setSc] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const searchParams = useSearchParams();
    useEffect(() => {
        setC(searchParams.get('c'));
        setSc(searchParams.get('sc'));
        setIsLoading(false)
    }, [searchParams]);
    return (
        <Suspense fallback={<></>}>
            {isLoading ? <></> : <AsyncProducts c={c} sc={sc} />}
        </Suspense>
    )
}