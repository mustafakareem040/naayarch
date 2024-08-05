import CustomProduct from "@/components/CustomProduct";
import SaleBanner from "@/components/SaleBanner";

export function ProductWithSales() {
    return (
        <div className="bg-[#F6F3F180] mb-8">
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