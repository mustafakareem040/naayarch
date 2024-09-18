'use client'
import Image from "next/image";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, X } from "lucide-react";
import ShoppingBag from "@/components/ShoppingBag";

const WishlistItem = ({ id, name, price, imageUrl, onRemove }) => (
    <div className="bg-white rounded-lg p-4 flex items-center space-x-4 relative mb-4">
        <Image src={imageUrl} alt={name} width={80} height={80} className="object-cover rounded-md" />
        <div className="flex-grow">
            <h3 className="font-medium text-sm">{name}</h3>
            <p className="text-sm text-gray-600">{price} IQD</p>
        </div>
        <button onClick={() => onRemove(id)} className="absolute top-2 right-2">
            <X size={20} />
        </button>
        <button className="bg-[#3B5345] rounded-full p-2">
            <ShoppingBag width={24} height={24} />
        </button>
    </div>
);

export default function Wishlist() {
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchWishlist = async () => {
        try {
            const response = await fetch('https://api.naayiq.com/wishlist');
            if (!response.ok) {
                throw new Error('Failed to fetch wishlist');
            }
            const data = await response.json();
            setWishlistItems(data);
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemoveItem = async (id) => {
        try {
            const response = await fetch(`https://api.naayiq.com/wishlist/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Failed to delete item from wishlist');
            }
            // Refresh the wishlist after successful deletion
            await fetchWishlist();
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
        }
    };

    return (
        <>
            <header className="flex items-center mb-6">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20" />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Wishlist
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center">
                {isLoading ? (
                    <p>Loading...</p>
                ) : wishlistItems.length === 0 ? (
                    <>
                        <div className="relative w-full h-[33vh]">
                            <Image
                                src="https://storage.naayiq.com/resources/empty_wishlist.gif"
                                alt="Empty wishlist"
                                fill
                                unoptimized={true}
                                priority={true}
                                quality={100}
                                className="object-contain"
                            />
                        </div>
                        <section>
                            <p className="font-serif text-3xl text-center mb-2 font-semibold">Wishlist is empty!</p>
                            <p className="font-serif text-lg text-center leading-none">Tab Heart Button to start</p>
                            <p className="font-serif text-lg text-center">saving your favorite item.</p>
                            <Link href={"/"} className="min-h-[56px] mt-4 items-center font-serif px-3 ssm:px-6 bg-[#3B5345] flex justify-center text-white text-xl rounded-lg">
                                Start Browsing
                            </Link>
                        </section>
                    </>
                ) : (
                    <div className="w-full max-w-md">
                        {wishlistItems.map(item => (
                            <WishlistItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                imageUrl={`https://storage.naayiq.com/resources/${item.id}.webp`}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}