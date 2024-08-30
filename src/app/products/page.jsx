// app/products/page.js
import { Suspense } from 'react';
import ProductList from '@/components/ProductList';
import SearchComponent from '@/components/SearchComponent';
import Pagination from '@/components/Pagination';
import { fetchProducts } from '@/lib/api';

export const dynamic = 'force-dynamic';

async function ProductsPage({ searchParams }) {
    const page = parseInt(searchParams.page) || 1;
    const search = searchParams.search || '';
    const category = searchParams.c || '';
    const subCategory = searchParams.sc || '';

    const { products, pagination } = await fetchProducts(page, search, category, subCategory);

    return (
        <>
            <header className="flex items-center mb-6">
                <button className="relative z-20">
                    <img src="/arrow-left.svg" width={40} height={40} alt="left" />
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">Products</h1>
            </header>

            <Suspense fallback={<div>Loading search...</div>}>
                <SearchComponent />
            </Suspense>

            <Suspense fallback={<div>Loading products...</div>}>
                <ProductList initialProducts={products} />
            </Suspense>

            {pagination.totalPages > 1 && (
                <Pagination
                    currentPage={pagination.currentPage}
                    totalPages={pagination.totalPages}
                />
            )}
        </>
    );
}

export default ProductsPage;