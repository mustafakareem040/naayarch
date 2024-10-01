'use client'
import { useEffect } from 'react';
export const getToken = () => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token'); // Adjust based on your token storage strategy
};
export default function IsAuth() {
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Clear all related data if there's no token
            localStorage.removeItem("userData");
            localStorage.removeItem("addresses");
            localStorage.removeItem("userId");
            return;
        }

        async function checkAuth() {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/check-auth`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    }
                });
                const data = await response.json();

                if (data.isAuthenticated) {
                    // Store addresses and userId separately
                    localStorage.setItem("addresses", JSON.stringify(data.addresses));
                    console.log(data)
                    console.log(data.userId )
                    localStorage.setItem("userId", data.userId);

                    // Store the rest of the user data
                    const { addresses, userId, ...restUserData } = data;
                    localStorage.setItem("userData", JSON.stringify(restUserData));

                    // Keep the token in localStorage
                    localStorage.setItem("token", token);
                } else {
                    // Clear data if not authenticated
                    localStorage.removeItem("userData");
                    localStorage.removeItem("addresses");
                    localStorage.removeItem("userId");
                    localStorage.removeItem("token");
                }
            } catch (error) {
                console.error("Error checking authentication:", error);
                // Optionally clear data on error
                localStorage.removeItem("userData");
                localStorage.removeItem("userId");
                localStorage.removeItem("token");
            }
        }

        checkAuth();
    }, []);

    return null;
}