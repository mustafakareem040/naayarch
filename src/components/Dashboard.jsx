import dynamic from 'next/dynamic';

const ProductSlider = dynamic(() => import('@/components/ProductSlider'));
const CustomProduct = dynamic(() => import('@/components/CustomProduct'));
const ProductCategorySlider = dynamic(() => import('@/components/ProductCategorySlider'));
const Footer = dynamic(() => import('@/components/Footer'))
import Hero from "@/components/Hero";
import {ProductWithSales} from "@/components/ProductWithSales";
import AsyncNavBar from "@/components/AsyncNavBar";

export default function Dashboard() {
    return (
        <div className="overflow-x-hidden max-w-3xl">
            <AsyncNavBar />
            <Hero />
            <ProductWithSales />
            <ProductSlider />
            <CustomProduct
                title="Our New Products"
                subtitle="Fenty Lipgloss"
                description="The ultimate lip gloss with shine that feels as good as it looks."
                bigimg="/woman2.webp"
                flower="/pingwing.webp"
            />
            <ProductCategorySlider />
            <Footer />
        </div>
    );
}
