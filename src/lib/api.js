// lib/api.js

const API_URL = "https://api.naayiq.com"
const PRODUCTS_PER_PAGE = 25;

export async function fetchProducts(page, search, category, subCategory) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: PRODUCTS_PER_PAGE.toString(),
        search: search || '',
        c: category || '',
        sc: subCategory || '',
    });

    try {
        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            cache: "force-cache",
            priority: "high",

        });

        if (!response.ok) {
            throw new Error('Failed to fetch more products');
        }

        return await response.json();
    } catch (error) {
        console.error('Error fetching more products:', error);
        return [];
    }
}