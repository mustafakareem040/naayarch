'use client'
import Image from "next/image";
import React from "react";

export default function ProductLoading() {
    return (
        <Image src={"https://storage.naayiq.com/resources/products-loading.gif"}
               loading={"eager"}
               priority={true}
               width={200}
               unoptimized={true}
               height={200}
               className="m-auto translate-y-12 text-center"
               alt={"Loading"}/>
    )
}
