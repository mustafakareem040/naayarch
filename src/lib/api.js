// lib/api.js

const API_URL = "https://api.naayiq.com"
const PRODUCTS_PER_PAGE = 10; // Adjust this value based on your needs

export async function fetchInitialProducts(page, search, category, subCategory) {
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
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching initial products:', error);
        return [];
    }
}

export async function fetchMoreProducts(page, search, category, subCategory) {
    const params = new URLSearchParams({
        page: page.toString(),
        limit: PRODUCTS_PER_PAGE.toString(),
        search: search || '',
        category: category || '',
        subCategory: subCategory || '',
    });

    try {
        const response = await fetch(`${API_URL}/products?${params.toString()}`, {
            headers: {
                'Content-Type': 'application/json',
            }
        });

        if (!response.ok) {
            throw new Error('Failed to fetch more products');
        }

        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching more products:', error);
        return [];
    }
}