'use client'
import React, { useState } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { getWishlistByProductId, addWishlist, deleteWishlist } from '@/lib/features/wishlistSlice';
import { useAppDispatch, useAppSelector } from "@/lib/hook";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const WishlistHeart = ({ product  }) => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const wishlistItem = useAppSelector((state) => getWishlistByProductId(state, product.id));
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showDialog, setShowDialog] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Loading state to prevent multiple clicks
    const handleClick = async (e) => {
        e.stopPropagation();

        if (isLoading) return; // Prevent multiple clicks

        if (!isAuthenticated) {
            setShowDialog(true);
            return;
        }

        setIsLoading(true);

        const method = wishlistItem ? "DELETE" : "POST";

        // Prepare optimistic actions
        if (wishlistItem) {
            // Optimistically remove from wishlist
            dispatch(deleteWishlist(wishlistItem.id));
        } else {
            // Optimistically add to wishlist with temporary ID or necessary fields
            dispatch(addWishlist({
                wishlist_id: Date.now(), // Temporary unique identifier
                ...product
            }));
        }

        try {
            const response = await fetch("https://api.naayiq.com/wishlist", {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ productId: product.id }),
            });

            if (response.ok) {
                if (method === "POST") {
                    const newWishlistItem = await response.json();
                    // Replace the temporary wishlist item with the one from the server
                    dispatch(deleteWishlist(Date.now())); // Remove temporary item
                    dispatch(addWishlist(newWishlistItem)); // Add the confirmed item from server
                }
                // No action needed for DELETE if successful
            } else {
                throw new Error('Failed to update wishlist');
            }
        } catch (error) {
            if (method === "DELETE") {
                dispatch(addWishlist(wishlistItem)); // Re-add the removed item
            } else {
                dispatch(deleteWishlist(Date.now())); // Remove the optimistically added item
            }
            console.error('Error updating wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignIn = (e) => {
        e.preventDefault();
        setIsRedirecting(true);
        setTimeout(() => {
            router.push('/signin');
        }, 1000);
    };

    const handleCancel = () => {
        setShowDialog(false);
    };

    return (
        <>
            <div className="relative">
                <motion.div
                    whileTap={{ scale: 0.8 }}
                    transition={{ duration: 0.3 }}
                >
                    <Heart
                        className={`w-[1.85rem] h-[1.85rem] z-10 stroke-[1.2] ${
                            wishlistItem
                                ? "fill-[#C91C1C] stroke-[#C91C1C]"
                                : "fill-transparent stroke-[#C91C1C] hover:fill-[#C91C1C]"
                        } cursor-pointer transition-colors duration-300`}
                        onClick={handleClick}
                    />
                </motion.div>
            </div>
            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent className="z-50">
                    <AlertDialogHeader>
                        <AlertDialogTitle className="font-sans font-medium">Sign in required</AlertDialogTitle>
                        <AlertDialogDescription className="font-serif">
                            You need to sign in first to add items to your wishlist.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="font-serif">
                        <Button variant="outline" onClick={handleCancel}>Cancel</Button>
                        <Button onClick={handleSignIn} disabled={isRedirecting}>
                            {isRedirecting ? 'Redirecting' : 'Sign In'}
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default WishlistHeart;