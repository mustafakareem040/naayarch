import MyOrders from "@/components/MyOrders";
import {NavBar} from "@/components/NavBar";
import NextTopLoader from "nextjs-toploader";

export default function OrdersPage() {
    return (
        <>
            <NavBar />
        <MyOrders />
            </>
    )
}