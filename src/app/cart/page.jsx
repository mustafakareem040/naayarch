import Cart from "@/components/Cart";
import {NotificationProvider} from "@/components/NotificationContext";
export const dynamic = 'force-dynamic'
export default function CartPage() {
    return (
    <NotificationProvider>
        <Cart />
    </NotificationProvider>)
}