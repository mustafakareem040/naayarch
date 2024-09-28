'use client'
import { useEffect } from 'react';
import { setIsAuthenticated } from "@/lib/features/authSlice";
import { setAddresses } from "@/lib/features/addressesSlice";
import { setUserInfo } from "@/lib/features/userSlice";
import { useAppDispatch } from "@/lib/hook";

export default function IsAuth() {
    const dispatch = useAppDispatch();
    useEffect(() => {
        async function checkAuth() {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/check-auth`,
                {credentials: "include"});
            const data = await response.json();
            if (data.isAuthenticated) {
                handleAuthResponse(data, dispatch);
            }
        }
        checkAuth();
    }, [dispatch]);

    return null;
}

export function handleAuthResponse(data, dispatch) {
    if (data.isAuthenticated) {
        dispatch(setIsAuthenticated(true));
        dispatch(setAddresses(data.addresses));
        dispatch(setUserInfo({
            userId: data.userId,
            name: data.name,
            email: data.email,
            phone: data.phone,
            dob: data.dob,
            role: data.role
        }));
    } else {
        dispatch(setIsAuthenticated(false));
        dispatch(setAddresses([]));
        dispatch(setUserInfo({}))
    }
}