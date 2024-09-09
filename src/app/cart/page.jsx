'use client'
import EmptyCart from "@/components/EmptyCart";
import Cart from "@/components/Cart";

export default function CartPage() {
    return localStorage.getItem("cart")?.length > 0 ? <Cart /> : <EmptyCart />
}