import CustomProduct from "./CustomProduct";
import SaleBanner from "./SaleBanner";
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
                description="Glow Up & Save! 10% off all products"
                bigimg="/face.webp"
                flower="/pingwing.webp"
                url={"/products"}
                hideFlower={true}
            />
            <SaleBanner />
        </div>
    )
}