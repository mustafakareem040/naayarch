'use client'
import React, { useState, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';

const WishlistHeart = ({ productId }) => {
    const [isInWishlist, setIsInWishlist] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const router = useRouter();

    useEffect(() => {
        if (isAuthenticated) {
            checkWishlistStatus();
        }
    }, [isAuthenticated, productId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await fetch(`/api/wishlist/check/${productId}`);
            if (response.ok) {
                const { isInWishlist } = await response.json();
                setIsInWishlist(isInWishlist);
            }
        } catch (error) {
            console.error('Error checking wishlist status:', error);
        }
    };

    const handleClick = async () => {
        if (!isAuthenticated) {
            router.push('/signin');
            return;
        }


        try {
            const endpoint = isInWishlist ? '/api/wishlist/remove' : '/api/wishlist/add';
            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ productId }),
            });
            if (response.ok) {
                setIsInWishlist(!isInWishlist);
            } else {
                console.error('Failed to update wishlist');
            }
        } catch (error) {
            console.error('Error updating wishlist:', error);
        }

    };

    return (
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
    );
};

export default WishlistHeart;