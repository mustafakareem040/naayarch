'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import AsyncNavBar from "@/components/AsyncNavBar";
import Footer from "@/components/Footer";
import {Profile} from "@/components/Profile";
import Image from "next/image";
import {useAppSelector} from "@/lib/hook";

async function getUserData() {
    const response = await fetch('https://api.naayiq.com/user/check-auth', {
        credentials: "include",
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return response.json();
}

export default function ProfileClient() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);

    useEffect(() => {
            if (!isAuthenticated) {
                router.push('/login');
            }
    }, [router]);

    return useMemo(() => {
        if (isLoading || !userData) {
            return null;
        }

        return (
            <>
                <div className="relative left-0 -translate-y-[10%] -m-4 right-0 min-h-[100vw] top-0 w-[100vw]">
                    <div className="font-sans absolute top-1/2 z-10 left-0 right-0 text-center text-3xl">
                        <p>Hi {userData.name}!</p>
                        <p className="text-base font-serif">Let your beauty shine!</p>
                    </div>
                    <Image src={"https://storage.naayiq.com/resources/bg_flowers.png"} unoptimized={true} alt={"bg_flowers"} fill={true}
                           className="object-contain"/>
                </div>
                <div className="h-screen flex flex-col justify-between">
                    <Profile/>
                    <Footer/>
                </div>
            </>
        );
    }, [userData, isLoading]);
}