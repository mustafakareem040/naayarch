'use client';

import { useEffect, useState } from 'react';
import { getAuthState, setAuthState, AUTH_KEY } from '@/lib/localStorage';

export default function IsAuth() {
    const [checked, setChecked] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const existingAuth = getAuthState();

            if (existingAuth) {
                setChecked(true);
                return;
            }

            try {
                const response = await fetch('https://api.naayiq.com/user/check-auth', {
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }

                const data = await response.json();

                if (data.isAuthenticated) {
                    localStorage.setItem("addresses", JSON.stringify(data.addresses | []));
                    setAuthState({
                        isAuthenticated: true,
                        addresses: data.addresses || [],
                        userInfo: {
                            userId: data.userId,
                            name: data.name,
                            email: data.email,
                            phone: data.phone,
                            dob: data.dob,
                            role: data.role,
                        },
                    });
                } else {
                    setAuthState({
                        isAuthenticated: false,
                        addresses: [],
                        userInfo: {},
                    });
                }
            } catch (error) {
                console.error('Failed to check auth:', error);
                // In case of error, ensure state is set to unauthenticated
                setAuthState({
                    isAuthenticated: false,
                    addresses: [],
                    userInfo: {},
                });
            } finally {
                setChecked(true);
            }
        };

        checkAuth();
    }, []);

    // Optionally, you can render a loading state until authentication is checked
    if (!checked) {
        return null; // Or a loading spinner/component
    }

    return null;
}