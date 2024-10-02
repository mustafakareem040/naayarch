'use client'
// hooks/useFetchOrderDetails.js
import { useEffect, useState } from 'react';
import {fetchWithAuth} from "@/lib/api";

const useFetchOrderDetails = (orderId) => {
    const [orderDetails, setOrderDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/cart`)


                // Adjust based on actual API response structure
                setOrderDetails(data.order);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetails();
        }
    }, [orderId]);

    return { orderDetails, loading, error };
};

export default useFetchOrderDetails;