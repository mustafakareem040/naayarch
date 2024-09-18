'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Footer from "@/components/Footer";
import { Profile } from "@/components/Profile";
import Image from "next/image";
import { useAppDispatch } from "@/lib/hook";
import Cookies from 'js-cookie';
import { setIsAuthenticated } from "@/lib/features/authSlice";
import { useSelector } from "react-redux";
import Loading from "@/components/Loading";
import {handleAuthResponse} from "@/components/isAuth";

export default function ProfileClient() {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { info } = useSelector(state => state.user);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        async function checkAuth() {
            const accessToken = Cookies.get('token');
            if (accessToken) {
                try {
                    const response = await fetch('https://api.naayiq.com/user/check-auth', {
                        credentials: "include"
                    });
                    const data = await response.json();
                    handleAuthResponse(data, dispatch);
                    if (!data.isAuthenticated) {
                        router.push('/login');
                    }
                } catch (error) {
                    console.error('Error checking authentication:', error);
                    router.push('/login');
                }
            } else {
                dispatch(setIsAuthenticated(false));
                router.push('/login');
            }
            setIsLoading(false);
        }

        const timer = setTimeout(checkAuth, 100); // Small delay to ensure smooth loading
        return () => clearTimeout(timer);
    }, [dispatch, router]);

    if (isLoading) {
        return <Loading />;
    }

    return (
        <>
            <div className="relative left-0 -translate-y-[10%] -m-4 right-0 min-h-[100vw] top-0 w-[100vw]">
                <div className="font-sans absolute top-1/2 z-10 left-0 right-0 text-center text-3xl">
                    <p>Hi {info?.name}!</p>
                    <p className="text-base font-serif">Let your beauty shine!</p>
                </div>
                <Image src="https://storage.naayiq.com/resources/bg_flowers.png" unoptimized={true} alt="bg_flowers" fill={true}
                       className="object-contain"/>
            </div>
            <div className="h-screen flex flex-col justify-between">
                <Profile/>
                <Footer/>
            </div>
        </>
    );
}