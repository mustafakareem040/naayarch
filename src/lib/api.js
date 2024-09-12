const API_URL = "https://api.naayiq.com";

export async function fetchAllProducts() {
    try {
        const response = await fetch(`${API_URL}/products?limit=1000`, {
            headers: {
                'Content-Type': 'application/json',
            },
            next: { revalidate: 3600 }, // Cache for 1 hour
        });

        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        return data.products;
    } catch (error) {
        console.error('Error fetching products:', error);
        return [];
    }
}