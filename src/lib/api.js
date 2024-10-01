// lib/api.js
'use client'


import {getToken} from "@/components/isAuth";
export function removeFileExtension(url) {
    if (!url) return url;
    return url.replace(/\.[^/.]+$/, '');
}
export const fetchWithAuth = async (url, options = {}) => {
    const token = getToken();
    if (token) {
        const headers = {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            ...options.headers,
        };

        const response = await fetch(url, {
            ...options,
            headers,
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'API request failed');
        }

        return response.json();
    }
};