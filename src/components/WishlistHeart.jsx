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

const WishlistHeart = ({ productId }) => {
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
    const wishlistItem = useAppSelector((state) => getWishlistByProductId(state, productId));
    const dispatch = useAppDispatch();
    const router = useRouter();
    const [showDialog, setShowDialog] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);

    const handleClick = async () => {
        if (!isAuthenticated) {
            setShowDialog(true);
            return;
        }

        try {
            const method = wishlistItem ? "DELETE" : "POST";
            const response = await fetch("https://api.naayiq.com/wishlist", {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: "include",
                body: JSON.stringify({ productId }),
            });

            if (response.ok) {
                if (wishlistItem) {
                    dispatch(deleteWishlist(wishlistItem.id));
                } else {
                    const newWishlistItem = await response.json();
                    dispatch(addWishlist(newWishlistItem));
                }
            } else {
                console.error('Failed to update wishlist');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
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
                <AlertDialogContent>
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