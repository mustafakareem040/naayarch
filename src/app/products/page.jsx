// /app/products/page.jsx

import React from 'react';
import ProductList from '@/components/ProductList';
import AsyncNavBar from '@/components/AsyncNavBar';
export const revalidate = 28800;

export async function generateMetadata({ searchParams }) {
    const { title } = await searchParams;

    const pageTitle = await title ? `${await title}` : 'All Products';

    const description = await title
        ? `Explore our ${await title} collection of Korean and global beauty products. Find the best skincare, makeup, and body care items from top brands at naayiq.com.`
        : 'Discover a wide range of Korean and global beauty products at naayiq.com. Shop skincare, makeup, and body care items from top brands worldwide.';

    return {
        title: pageTitle,
        description: description,
        openGraph: {
            title: pageTitle,
            description: description,
            url: 'https://naayiq.com/products',
            siteName: 'NaayIraq',
            locale: 'en_IQ',
            type: 'website',
        },
        additionalMetaTags: [
            {
                name: "robots",
                content: "index, follow"
            },
            {
                name: "viewport",
                content: "width=device-width, initial-scale=1"
            }
        ],
        alternates: {
            canonical: 'https://naayiq.com/products',
            languages: {
                'en-us': 'https://naayiq.com/products',
            },
        },
    };
}

const ProductsPage = async ({ searchParams }) => {
    const { c = '', sc = '', b = '', title = '', sortBy = '' } = await searchParams;

    return (
        <>
            <AsyncNavBar />
            <ProductList initialFilters={{ c, sc, b, title, sortBy }} />

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "CollectionPage",
                        "name": title ? `${title}` : "All Products",
                        "description": title
                            ? `Explore our ${title} collection of Korean and global beauty products.`
                            : 'Discover a wide range of Korean and global beauty products.',
                        "url": "https://naayiq.com/products"
                    }) }}
            />
        </>
    );
};



export default ProductsPage;