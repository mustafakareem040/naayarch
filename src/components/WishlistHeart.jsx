import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const WishlistHeart = ({ id, isInWishlist2 }) => {
    const [isInWishlist, setIsInWishlist] = useState(isInWishlist2);
    const [showDialog, setShowDialog] = useState(false);
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();


    const handleClick = async (e) => {
        e.stopPropagation();
        if (isLoading) return;

        const token = localStorage.getItem("token");
        if (!token) {
            setShowDialog(true);
            return;
        }

        setIsLoading(true);
        const method = isInWishlist ? "DELETE" : "POST";

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/wishlist`, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ product_id: id }),
            });
            setIsInWishlist(!isInWishlist);
            if (!response.ok) {
                setIsInWishlist(!isInWishlist)
            }
        } catch (error) {
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
                            isInWishlist
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