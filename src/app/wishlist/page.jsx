'use client'
import Image from "next/image";
import React from "react";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {CircleArrowLeft} from "lucide-react";

export default function Wishlist() {
    const router = useRouter()
    return (
        <>
            <header className="flex items-center mb-6">
                <CircleArrowLeft size={52} strokeWidth={0.7} onClick={router.back} className="p-2 relative z-20" />
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    Wishlist
                </h1>
            </header>
            <main className="flex-grow flex flex-col items-center">
                <div className="relative w-full h-[33vh]">
                    <Image
                        src="https://storage.naayiq.com/resources/empty_wishlist.gif"
                        alt="Empty cart"
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
            </main>
            </>
            )
            }