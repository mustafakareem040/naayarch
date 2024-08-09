// components/AuthWrapper.js
'use client'
import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import {useAuth} from "@/components/UseAuth";

export default function AuthWrapper({ children }) {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const router = useRouter();
    useAuth(); // This will run the authentication check

    useEffect(() => {
        if (!isAuthenticated) {
            // router.push('/login');
        }
    }, [isAuthenticated, router]);

    return children;
}