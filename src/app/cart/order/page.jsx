'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartCheckout from "@/components/CartCheckout";
import { useAppSelector } from "@/lib/hook";
import { NotificationProvider } from "@/components/NotificationContext";
import Loading from "@/components/Loading";

export default function OrderNow() {
    const { subTotal, delivery, discount } = useAppSelector(state => state.order.info);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (typeof subTotal === "number" && typeof delivery === "number" && typeof discount === "number") {
            setIsLoading(false);
        } else {
            const timer = setTimeout(() => {
                router.push('/cart');
            }, 500);
            return () => clearTimeout(timer);
        }
    }, [subTotal, delivery, discount, router]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <NotificationProvider>
            <CartCheckout subTotal={subTotal} delivery={delivery} discount={discount} />
        </NotificationProvider>
    );
}