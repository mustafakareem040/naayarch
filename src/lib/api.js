export async function fetchProducts(page = 1, search = '', category = '', subCategory = '') {
    const url = new URL('https://api.naayiq.com/products');
    url.searchParams.append('page', page);
    url.searchParams.append('search', search);
    if (category) url.searchParams.append('c', category);
    if (subCategory) url.searchParams.append('sc', subCategory);

    const response = await fetch(url.toString(), { next: { revalidate: 60 } });
    if (!response.ok) throw new Error('Failed to fetch products');

    const data = await response.json();
    return {
        products: data.products || [],
        pagination: {
            currentPage: data.pagination?.currentPage || 1,
            totalPages: data.pagination?.totalPages || 1,
        },
    };
}