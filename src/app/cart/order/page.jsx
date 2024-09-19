
'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CartCheckout from "@/components/CartCheckout";
import { useAppSelector } from "@/lib/hook";
import { NotificationProvider } from "@/components/NotificationContext";
import Loading from "@/components/Loading";

export default function OrderNow() {
    const { subTotal, delivery, discount } = useAppSelector(state => state.order.info);
    const router = useRouter();

    const isOrderDataPresent = (
        typeof subTotal === "number" &&
        typeof discount === "number"
    );

    useEffect(() => {
        if (!isOrderDataPresent) {
            setTimeout(() => router.push('/cart'), 500);
        }
    }, [isOrderDataPresent, router]);

    if (!isOrderDataPresent) {
        return <Loading />;
    }

    return (
        <NotificationProvider>
            <CartCheckout subTotal={subTotal} delivery={delivery} discount={discount} />
        </NotificationProvider>
    );
}