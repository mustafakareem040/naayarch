'use client'
import Image from "next/image";
import React, { useState, useEffect, useOptimistic } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CircleArrowLeft, X } from "lucide-react";
import ShoppingBag from "@/components/ShoppingBag";
import Loading from "@/components/Loading";

const WishlistItem = ({ id, name, price, imageUrl, onRemove }) => {
    const router = useRouter();

    const handleShoppingBagClick = () => {
        router.push(`/products/${id}`);
    };

    return (
        <div className="bg-white rounded-lg p-4 flex items-stretch space-x-4 mb-4">
            <div className="relative w-[30%] min-h-[120px]">
                <Image
                    src={imageUrl}
                    alt={name}
                    fill={true}
                    unoptimized={true}
                    className="object-cover rounded-md"
                />
            </div>
            <div className="flex-grow flex flex-col justify-center">
                <h3 className="font-serif font-medium text-base text-center">{name}</h3>
            </div>
            <div className="flex flex-col justify-center items-center space-y-2">
                <button onClick={() => onRemove(id)} className="p-1">
                    <X size={24} />
                </button>
                <button onClick={handleShoppingBagClick} className="bg-[#3B5345] rounded-full p-2">
                    <ShoppingBag width={24} height={24} />
                </button>
            </div>
        </div>
    );
};

export default function Wishlist() {
    const router = useRouter();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const [optimisticWishlist, addOptimisticWishlistItem] = useOptimistic(
        wishlistItems,
        (state, newItem) => [...state, newItem]
    );

    const fetchWishlist = async () => {
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/wishlist`,
                {
                    credentials: "include"
                });
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
        // Optimistically remove the item from the UI
        const updatedItems = optimisticWishlist.filter(item => item.id !== id);
        addOptimisticWishlistItem(updatedItems);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/wishlist/${id}`, {
                method: 'DELETE',
                credentials: "include"
            });
            if (!response.ok) {
                throw new Error('Failed to delete item from wishlist');
            }
            // Update the actual state after successful deletion
            setWishlistItems(updatedItems);
        } catch (error) {
            console.error('Error removing item from wishlist:', error);
            // Revert the optimistic update if the server request fails
            await fetchWishlist();
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
                    <Loading />
                ) : optimisticWishlist.length === 0 ? (
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
                            <Link href={"/nay-store/public"} className="min-h-[56px] mt-4 items-center font-serif px-3 ssm:px-6 bg-[#3B5345] flex justify-center text-white text-xl rounded-lg">
                                Start Browsing
                            </Link>
                        </section>
                    </>
                ) : (
                    <div className="w-full max-w-md">
                        {optimisticWishlist.map(item => (
                            <WishlistItem
                                key={item.id}
                                id={item.id}
                                name={item.name}
                                price={item.price}
                                imageUrl={`https://storage.naayiq.com/resources/${item.images[0]}`}
                                onRemove={handleRemoveItem}
                            />
                        ))}
                    </div>
                )}
            </main>
        </>
    );
}