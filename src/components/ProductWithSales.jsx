import CustomProduct from "@/components/CustomProduct";
import SaleBanner from "@/components/SaleBanner";
import Image from "next/image";
import React from "react";

export function ProductWithSales() {
    return (
        <div className="bg-[#F6F3F17F] mb-8">
            <Image src="/star.svg" alt={"star"} width={50} height={50}
            className="absolute scale-75 ssm2:left-10 ssm3:left-16 ssm5:left-[20%] ssm:scale-100" />
            <CustomProduct
                title="Special Offer"
                subtitle="Don't Miss The Chance!"
                description="Glow Up & Save! 20% off all products"
                bigimg="/face.png"
                flower="/pingwing.png"
                hideFlower={true}
            />
            <div className="-mb-16"></div>
            <SaleBanner />
        </div>
    )
}