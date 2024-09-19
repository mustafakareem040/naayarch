'use client'
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartCheckout from "@/components/CartCheckout";
import { NotificationProvider } from "@/components/NotificationContext";
import Loading from "@/components/Loading";

export default function OrderNow() {
    const [orderData, setOrderData] = useState(null);
    const router = useRouter();

    useEffect(() => {
        const storedOrderData = localStorage.getItem('orderData');
        if (storedOrderData) {
            const parsedOrderData = JSON.parse(storedOrderData);
            setOrderData(parsedOrderData);
        } else {
            router.push('/cart');
        }
    }, [router]);

    if (!orderData) {
        return <Loading />;
    }

    const { subTotal, delivery, discount } = orderData.info;

    return (
        <NotificationProvider>
            <CartCheckout subTotal={subTotal} delivery={delivery} discount={discount} />
        </NotificationProvider>
    );
}