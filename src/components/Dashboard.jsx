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
        <div className="overflow-x-hidden">
            <AsyncNavBar />
            <Hero />
            <ProductWithSales />
            <ProductSlider />
            <CustomProduct
                title="Our New Products"
                subtitle="Fenty Lipgloss"
                description="The ultimate lip gloss with shine that feels as good as it looks."
                bigimg="/blackface.webp"
                flower="/pingwing.webp"
            />
            <ProductCategorySlider />
            <CustomProduct
                title="Makeup Product"
                subtitle="Best Product"
                description="We are here to help our most popular product will help you to create best look"
                bigimg="/woman.webp"
                flower="/whiteflower.webp"
            />
            <Footer />
        </div>
    );
}
