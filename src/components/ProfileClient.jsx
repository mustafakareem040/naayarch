'use client';

import {useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/navigation';
import Footer from "@/components/Footer";
import {Profile} from "@/components/Profile";
import Image from "next/image";

async function getUserData() {
    const timestamp = new Date().getTime();
    const url = `https://api.naayiq.com/user/check-auth?_=${timestamp}`;
    const response = await fetch(url, {
        credentials: "include",
        headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache',
            'Expires': '0',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }
    return await response.json();
}

export default function ProfileClient() {
    const router = useRouter();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getUserData()
            .then(data => {
                if (!data.isAuthenticated) {
                    router.push('/login');
                } else {
                    setUserData(data);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                router.push('/login');
            })
            .finally(() => {
                setIsLoading(false);
            });
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