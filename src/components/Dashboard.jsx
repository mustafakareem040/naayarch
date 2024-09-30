// app/dashboard/page.jsx or wherever your Dashboard component is located

import dynamic from 'next/dynamic';
import Hero from "@/components/Hero";
import { ProductWithSales } from "@/components/ProductWithSales";
import AsyncNavBar from "@/components/AsyncNavBar";

const ProductSlider = dynamic(() => import('@/components/ProductSlider'), {
    suspense: false,
});
const CustomProduct = dynamic(() => import('@/components/CustomProduct'));
const ProductCategorySlider = dynamic(() => import('@/components/ProductCategorySlider'));
const Footer = dynamic(() => import('@/components/Footer'));

export default async function Dashboard() {
    const res = await fetch('https://dev.naayiq.com/products/top-selling', {
        next: { revalidate: 60 },
    });

    if (!res.ok) {
        console.error('Failed to fetch top-selling products');
        return <div>Error loading products.</div>;
    }

    const data = await res.json();
    const products = data.products || []; // Ensure products is an array

    return (
        <div className="overflow-x-hidden">
            <AsyncNavBar />
            <Hero />
            <ProductWithSales />
            <ProductSlider products={products} /> {/* Pass products as props */}
            <CustomProduct
                title="Our New Products"
                subtitle="Check out our new products"
                description="Keep up to date with our latest products and make your skin glowing."
                bigimg="/woman2.webp"
                flower="/pingwing.webp"
            />
            <ProductCategorySlider />
            <CustomProduct
                title="Makeup Product"
                subtitle="Makeup and beauty 💄"
                description="Our most popular product will help you to create best look"
                bigimg="/woman.webp"
                flower="/whiteflower.webp"
            />
            <Footer />
        </div>
    );
}