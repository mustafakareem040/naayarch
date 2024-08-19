import MyCoupons from "@/components/Coupon";
import Footer from "@/components/Footer";

export default function CouponPage() {
    return (
        <main className="h-screen flex flex-col justify-between">
            <MyCoupons />
            <Footer />
        </main>
    )
}