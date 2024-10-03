import React, { Suspense } from "react";
import ProductDetail from "@/components/ProductDetail";
import Loading from "@/components/Loading";
import { NotificationProvider } from "@/components/NotificationContext";

async function fetchProduct(id) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API}/products/${id}`);
    if (!response.ok) {
        throw new Error('Failed to fetch product');
    }
    return response.json();
}

// Add metadata generation
export async function generateMetadata({ params }) {
    try {
        const { product } = await fetchProduct(params.id);

        return {
            title: `${product.name} | Naay`,
            description: product.description?.slice(0, 155) || `Buy ${product.name} - premium beauty product available at Naay, Iraq's leading Korean and global beauty store.`,
            openGraph: {
                title: `${product.name} | Naay Iraq`,
                description: product.description?.slice(0, 155) || `Discover ${product.name} at Naay. Premium beauty products for discerning customers in Iraq.`,
                images: product.images?.map(img => ({
                    url: img,
                    alt: product.name
                })) || [],
                type: 'product',
                product: {
                    retailer_item_id: product.id,
                    price: product.price,
                    currency: 'IQD',
                    availability: product.inStock ? 'in stock' : 'out of stock',
                    condition: 'new'
                }
            },
            robots: {
                index: true,
                follow: true,
                'max-image-preview': 'large',
                'max-video-preview': -1,
                'max-snippet': -1,
            },
        };
    } catch (error) {
        console.error('Error generating metadata:', error);
        return {
            title: 'Product | Naay',
            description: 'Discover premium beauty products at Naay, Iraq\'s leading Korean and global beauty store.',
        };
    }
}

async function ProductContent({ id }) {
    const { product } = await fetchProduct(id);

    return (
        <ProductDetail
            product={product}
        />
    );
}

// Optionally, add JSON-LD structured data
export async function generateJsonLd({ params }) {
    try {
        const { product } = await fetchProduct(params.id);

        return {
            '@context': 'https://schema.org',
            '@type': 'Product',
            name: product.name,
            description: product.description,
            image: product.images,
            sku: product.id,
            brand: {
                '@type': 'Brand',
                name: product.brand
            },
            offers: {
                '@type': 'Offer',
                url: `https://naayiq.com/products/${product.id}`,
                priceCurrency: 'IQD',
                price: product.price,
                availability: product.inStock ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
                seller: {
                    '@type': 'Organization',
                    name: 'Naay'
                }
            }
        };
    } catch (error) {
        console.error('Error generating JSON-LD:', error);
        return null;
    }
}

// If you want to use the JSON-LD data, you'll need to modify your component to include it:
export default async function ProductDetailsPage({params}) {
    const jsonLd = await generateJsonLd({ params });

    return (
        <NotificationProvider>
            {jsonLd && (
                <script
                    type="application/ld+json"
                    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
                />
            )}
            <Suspense fallback={<Loading/>}>
                <ProductContent id={await params.id}/>
            </Suspense>
        </NotificationProvider>
    );
}