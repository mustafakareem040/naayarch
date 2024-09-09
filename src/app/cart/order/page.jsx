import {redirect} from "next/navigation";
import CartCheckout from "@/components/CartCheckout";

export default function OrderNow({subTotal, delivery, discount}) {
    if (typeof subTotal !== "number" || typeof delivery !== "number" || typeof discount !== "number") {
        redirect("/cart")
    }
    else {
        return <CartCheckout subTotal={subTotal} delivery={delivery} discount={discount}/>
    }
}