import Cart from "@/components/Cart";
import {NotificationProvider} from "@/components/NotificationContext";

export default function CartPage() {
    return (
    <NotificationProvider>
        <Cart />
    </NotificationProvider>)
}