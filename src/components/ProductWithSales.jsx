import CustomProduct from "@/components/CustomProduct";
import SaleBanner from "@/components/SaleBanner";
import Image from "next/image";
export function ProductWithSales() {
    return (
        <div className="white mb-12">
            <Image src="https://storage.naayiq.com/resources/star.svg" alt={"star"} width={35} height={35}
                   unoptimized={true}
            className="absolute scale-75 ssm2:left-10 ssm3:left-16 ssm5:left-[20%] ssm:scale-100" />
            <CustomProduct
                title="Special Offer"
                subtitle="Don't Miss The Chance!"
                description="Glow Up & Save! 20% off all products"
                bigimg="/face.png"
                flower="/pingwing.png"
                hideFlower={true}
            />
            <SaleBanner />
        </div>
    )
}