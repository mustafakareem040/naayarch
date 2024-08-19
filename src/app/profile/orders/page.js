import MyOrders from "@/components/MyOrders";
import {NavBar} from "@/components/NavBar";
import NextTopLoader from "nextjs-toploader";
import Footer from "@/components/Footer";
export const runtime = "edge";

export default function OrdersPage() {
    return (
        <div className="h-screen flex flex-col justify-between">
        <MyOrders />
        <Footer />
        </div>
    )
}