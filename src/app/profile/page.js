import React from 'react';
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";
import {Profile} from "@/components/Profile";
import AsyncNavBar from "@/components/AsyncNavBar";
import Image from "next/image";
export const experimental_ppr = true
export default function ProfilePage() {
    return (
        <>
            <AsyncNavBar bg={"#F6F3F1"} />
            <div className="relative left-0 -translate-y-[10%] -m-4 right-0 min-h-[100vw] top-0 -mb-[25%] w-[100vw]">
                <div className="font-sans absolute top-1/2 z-10 left-0 right-0 text-center text-3xl">
                    <p>Hi Mustafa!</p>
                    <p className="text-base font-serif">Let your beauty shine!</p>
                </div>
            <Image  src={"/bg_flowers.png"} alt={"bg_flowers"} fill={true}
            className="object-contain"/>
            </div>
            <div className="h-screen flex flex-col justify-between">
                <Profile />
            <Footer />
            </div>
        </>
    );
}