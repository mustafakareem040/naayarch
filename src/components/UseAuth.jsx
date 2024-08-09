// hooks/useAuth.js
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { setAuth, clearAuth } from '@/store/authSlice';

export function useAuth() {
    const dispatch = useDispatch();
    const router = useRouter();

    useEffect(() => {
        const validateToken = async () => {
            try {
                const response = await axios.get('https://nay-backend.vercel.app/api/user/validate-token', {
                    withCredentials: true // This is important for sending cookies
                });

                if (response.data.valid) {
                    dispatch(setAuth({ isAuthenticated: true, user: response.data.user }));
                } else {
                    dispatch(clearAuth());
                    // router.push('/login');
                }
            } catch (error) {
                console.error('Error validating token:', error);
                dispatch(clearAuth());
                // router.push('/login');
            }
        };

        validateToken();
    }, [dispatch, router]);
}