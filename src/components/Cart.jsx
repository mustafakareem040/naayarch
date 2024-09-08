'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import CartItem from './CartItem';

const Cart = () => {
    const [cartItems, setCartItems] = useState([]);
    const [subTotal, setSubTotal] = useState(0);
    const [delivery, setDelivery] = useState(5000);
    const [discount, setDiscount] = useState(0);
    const [coupon, setCoupon] = useState('');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchCartItems = async () => {
            const storedCart = JSON.parse(localStorage.getItem('cart')) || [];
            const itemsWithDetails = await Promise.all(
                storedCart.map(async (item) => {
                    try {
                        const response = await fetch(`https://api.naayiq.com/products/${item.product_id}`);
                        const data = await response.json();
                        const product = data.product;
                        const selectedSize = product.sizes.find(size => size.id === item.size_id);
                        const selectedColor = product.colors.find(color => color.id === item.color_id);

                        return {
                            ...item,
                            title: product.name,
                            image: selectedSize?.images[0] || product.images[0]?.url || 'https://via.placeholder.com/80',
                            price: parseInt(selectedSize?.price || product.price),
                            color: selectedColor?.name,
                            size: selectedSize?.name,
                        };
                    } catch (error) {
                        console.error('Error fetching product details:', error);
                        return item;
                    }
                })
            );
            setCartItems(itemsWithDetails);
            setIsLoading(false);
        };

        fetchCartItems();
    }, []);

    useEffect(() => {
        const total = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
        setSubTotal(total);
    }, [cartItems]);

    const handleUpdateQuantity = (id, newQty) => {
        const updatedItems = cartItems.map(item =>
            item.product_id === id ? { ...item, qty: newQty } : item
        );
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    const handleRemoveItem = (id) => {
        const updatedItems = cartItems.filter(item => item.product_id !== id);
        setCartItems(updatedItems);
        localStorage.setItem('cart', JSON.stringify(updatedItems));
    };

    const handleApplyCoupon = () => {
        if (coupon === "FREE")
            setDiscount(5000);
    };

    if (isLoading) {
        return <div className="p-4 max-w-lg mx-auto">Loading...</div>;
    }

    return (
        <div className="p-4 font-serif container mx-auto">
            <div className="flex items-center mb-6">
                <Link href="/" className="mr-4">
                    <ArrowLeft className="w-6 h-6" />
                </Link>
                <h1 className="text-2xl font-bold">Cart</h1>
            </div>

            {cartItems.map(item => (
                <CartItem
                    key={item.product_id}
                    id={item.product_id}
                    title={item.title}
                    color={item.color}
                    image={item.image}
                    size={item.size}
                    qty={item.qty}
                    price={item.price}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemove={handleRemoveItem}
                />
            ))}

            <div className="mt-8 bg-white rounded-lg shadow p-4">
                <h2 className="text-xl font-sans font-medium mb-4">Price Details</h2>
                <div className="flex justify-between mb-2">
                    <span>Discounted Coupon</span>
                    <div className="flex">
                        <input
                            type="text"
                            value={coupon}
                            onChange={(e) => setCoupon(e.target.value)}
                            className="border rounded px-2 py-1 mr-2"
                            placeholder="Enter coupon"
                        />
                        <button
                            onClick={handleApplyCoupon}
                            className="bg-[#3B5345] text-white px-3 py-1 rounded"
                        >
                            Apply
                        </button>
                    </div>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Sub-total</span>
                    <span>{subTotal} IQD</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Delivery</span>
                    <span>{delivery} IQD</span>
                </div>
                <div className="flex justify-between mb-2">
                    <span>Discount</span>
                    <span>{discount > 0 ? "-" : ""}{discount} IQD</span>
                </div>
                <div className="flex justify-between font-bold mt-4">
                    <span>Total Price</span>
                    <span>{subTotal + delivery - discount} IQD</span>
                </div>
            </div>

            <button className="w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg mt-6">
                Proceed
            </button>
        </div>
    );
};

export default Cart;