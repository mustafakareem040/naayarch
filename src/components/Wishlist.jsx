// src/pages/Wishlist.jsx

'use client';

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleArrowLeft } from "lucide-react";
import WishlistItem from "@/components/WishlistItem";
import Loading from "@/components/Loading";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image"; // Import AnimatePresence and motion

export const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token'); // Adjust based on your token storage strategy
};

export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    if (token) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        return response.json();
    }
};

export default function Wishlist() {
    const router = useRouter();
    const [wishlistProductIds, setWishlistProductIds] = useState([]);
    const [wishlistProducts, setWishlistProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Overall loading state
    const [error, setError] = useState(null);

    // Fetch Wishlist IDs and Products
    const fetchWishlist = useCallback(async () => {
        try {
            const data = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/wishlist`);
            if (data) {
                if (!Array.isArray(data.wishlist)) {
                    throw new Error('Invalid wishlist data format');
                }
                setWishlistProductIds(data.wishlist); // Assuming data.wishlist is an array of { id: ... }

                // Fetch all products in parallel
                const productPromises = data.wishlist.map(async (item) => {
                    try {
                        const productData = await fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/products/${item.id}`);
                        return productData.product;
                    } catch (err) {
                        console.error(`Error fetching product with ID ${item.id}:`, err);
                        setError('Some wishlist items failed to load.');
                        return null;
                    }
                });

                const products = await Promise.all(productPromises);
                const validProducts = products.filter(p => p !== null);
                setWishlistProducts(validProducts);
            }
        } catch (err) {
            console.error('Error fetching wishlist:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Initial Data Fetch
    useEffect(() => {
        fetchWishlist();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Handle Remove Item
    const handleRemoveItem = useCallback(async (productId) => {
        // Optimistically remove the item from UI
        setWishlistProductIds(prevIds => prevIds.filter(id => id.id !== productId));
        setWishlistProducts(prevProducts => prevProducts.filter(p => p.id !== productId));

        try {
            await fetchWithAuth(`${process.env.NEXT_PUBLIC_API}/wishlist/`, {
                body: JSON.stringify({ product_id: productId }),
                method: 'DELETE',
            });
            // Successfully removed on server
        } catch (err) {
            console.error('Error removing item:', err);
            setError('Failed to remove item from wishlist.');
            // Revert UI changes
            fetchWishlist();
        }
    }, [fetchWishlist]);

    if (isLoading) {
        return <Loading />; // Display the Loading component while fetching
    }

    return (
        <>
            <header className="flex items-center mb-6 px-4">
                <CircleArrowLeft
                    size={52}
                    strokeWidth={0.7}
                    onClick={() => router.back()}
                    className="p-2 relative z-20 cursor-pointer"
                />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Wishlist
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center px-4">
                {error && (
                    <div className="text-red-500 text-center mb-4">{error}</div>
                )}
                {wishlistProductIds.length === 0 ? (
                    <EmptyWishlist />
                ) : (
                    <div className="w-full max-w-md">
                        <AnimatePresence>
                            {wishlistProducts.map((product) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <WishlistItem
                                        product={product}
                                        onRemove={handleRemoveItem}
                                    />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </main>
        </>
    );
}

const EmptyWishlist = () => (
    <>
        <div className="relative w-full h-[33vh]">
            <Image
                src="https://storage.naayiq.com/resources/empty_wishlist.gif"
                alt="Empty wishlist"
                fill={true}
                className="object-contain w-full h-full"
            />
        </div>
        <section className="font-serif text-center">
            <p className="text-3xl mb-2 font-semibold">Wishlist is empty!</p>
            <p className="text-lg leading-none">Tap the Heart Button to start</p>
            <p className="text-lg">saving your favorite items.</p>
            <Link href="/" className="min-h-[56px] mt-4 inline-flex items-center justify-center px-6 sm:px-6 bg-[#3B5345] text-white text-lg rounded-lg">
                Start Browsing
            </Link>
        </section>
    </>
);

