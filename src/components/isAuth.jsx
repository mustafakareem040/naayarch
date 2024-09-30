'use client'
import { useEffect } from 'react';
import { setIsAuthenticated } from "@/lib/features/authSlice";
import { setAddresses } from "@/lib/features/addressesSlice";
import { setUserInfo } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hook";


export default function IsAuth() {
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            localStorage.removeItem("userData")
            return;
        }
        async function checkAuth() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/check-auth`, {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                }
            });
            const data = await response.json();
            if (data.isAuthenticated) {
                localStorage.setItem("userData", data)
            }
        }
        checkAuth();
    }, []);

    return null;
}