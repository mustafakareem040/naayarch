'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import SearchComponent from "@/components/SearchComponent";
import { useRouter } from "next/navigation";
import ProductItem from "@/components/ProductItem";

export default function Products({ initialData }) {
    const [query, setQuery] = useState("");
    const [products, setProducts] = useState(initialData.products);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    return (
        <>
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>
            <SearchComponent query={query} setQuery={setQuery} />
            <div className="my-12" />
            <div className="grid pt-20 grid-cols-2 w-full justify-between gap-4 sm:gap-6 ssm3:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
                {products.map((product) => (
                    <ProductItem
                        key={product.id}
                        title={product.name}
                        price={`${product.price} IQD`}
                        imageUrl={`https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"}
                    />
                ))}
                {loading && Array.from({ length: 10 }).map((_, index) => (
                    <ProductItemSkeleton key={`skeleton-${index}`} />
                ))}
            </div>

        </>
    )
}

function ProductItemSkeleton() {
    return (
        <div className="bg-gradient-custom relative flex flex-col w-full pb-16 animate-pulse">
            <div className="relative w-full h-0 pb-[100%] bg-gray-200 rounded-t-lg"></div>
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-custom rounded-lg p-3 flex flex-col justify-end h-2/5">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="flex justify-between items-center mt-2">
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                </div>
            </div>
        </div>
    );
}