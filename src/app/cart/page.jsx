import Cart from "@/components/Cart";
import {NotificationProvider} from "@/components/NotificationContext";
export const dynamic = 'force-dynamic'
export const metadata = {
    title: "Order",
    openGraph: {
        title: "Order",
    },
};
export default function CartPage() {
    return (
    <NotificationProvider>
        <Cart />
    </NotificationProvider>)
}