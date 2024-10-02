'use client'
import { useEffect, useState } from 'react';
import {fetchWithAuth} from "@/lib/api";

const useFetchOrders = (userId) => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCarts = async () => {
            try {
                const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/cart`)


                if (data.carts && data.carts.length > 0) {
                    // Extract unique product_ids to avoid redundant fetches
                    const uniqueProductIds = [
                        ...new Set(
                            data.carts.flatMap(cart => cart.items.map(item => item.product_id))
                        )
                    ];

                    // Fetch all products in parallel
                    const productPromises = uniqueProductIds.map(id =>
                        fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`).then(response => {
                            if (!response.ok) {
                                throw new Error(`Failed to fetch product with ID ${id}`);
                            }
                            return response.json();
                        })
                    );

                    const productsData = await Promise.all(productPromises);
                    // Create a map for easy lookup
                    const productsMap = {};
                    productsData.forEach(prod => {
                        productsMap[prod.product.id] = prod.product;
                    });

                    // Merge product details into cart items
                    const mergedCarts = data.carts.map(cart => ({
                        ...cart,
                        items: cart.items.map(item => ({
                            ...item,
                            product: productsMap[item.product_id]
                        }))
                    }));

                    setOrders(mergedCarts);
                } else {
                    setOrders([]);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCarts();
    }, [userId]);

    return { orders, loading, error };
};

export default useFetchOrders;