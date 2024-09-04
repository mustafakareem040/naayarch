'use client'
import Image from "next/image";
import React from "react";

export default function ProductLoading() {
    return (
        <Image src={"/products-loading.gif"}
               loading={"eager"}
               priority={true}
               width={200}
               height={200}
               className="m-auto text-center"
               alt={"Loading"}/>
    )
}
