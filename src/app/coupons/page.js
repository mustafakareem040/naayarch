import MyOrders from "@/components/MyOrders";
import {NavBar} from "@/components/NavBar";
import NextTopLoader from "nextjs-toploader";
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