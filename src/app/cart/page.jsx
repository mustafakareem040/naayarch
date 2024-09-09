'use client'
import EmptyCart from "@/components/EmptyCart";
import Cart from "@/components/Cart";
import CartCheckout from "@/components/CartCheckout";
import { useEffect, useState } from "react";
import Loading from "@/components/Loading";

export default function CartPage() {
    const [items, setItems] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [showCheckout, setShowCheckout] = useState(false)
    const [cartData, setCartData] = useState({ subTotal: 0, delivery: 0, discount: 0 })

    useEffect(() => {
        const cartItems = JSON.parse(localStorage.getItem("cart")) || []
        setItems(cartItems.length > 0)
        setIsLoading(false)
    }, []);

    const handleProceed = (data) => {
        setCartData(data)
        setShowCheckout(true)
    }

    const handleBackToCart = () => {
        setShowCheckout(false)
    }

    if (isLoading)
        return <Loading />

    if (!items)
        return <EmptyCart />

    return showCheckout
        ? <CartCheckout {...cartData} onBack={handleBackToCart} />
        : <Cart onProceed={handleProceed} />
}