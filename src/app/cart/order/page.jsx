'use client'
import {redirect} from "next/navigation";
import CartCheckout from "@/components/CartCheckout";
import {useAppSelector} from "@/lib/hook";
import {NotificationProvider} from "@/components/NotificationContext";

export default function OrderNow() {
    const {subTotal, delivery, discount} = useAppSelector(state => state.order.info);
    if (typeof subTotal !== "number" || typeof delivery !== "number" || typeof discount !== "number") {
        redirect("/cart")
    }
else {
        return (
            <NotificationProvider>
                <CartCheckout subTotal={subTotal} delivery={delivery} discount={discount}/>
            </NotificationProvider>
        )
    }
}