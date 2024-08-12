import { Suspense } from "react";
import Hero from "@/components/Hero";
import {ProductWithSales} from "@/components/ProductWithSales";
import ProductSlider from "@/components/ProductSlider";
import CustomProduct from "@/components/CustomProduct";
import ProductCategorySlider from "@/components/ProductCategorySlider";
import Footer from "@/components/Footer";
import {NavBar} from "@/components/NavBar";
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
                bigimg="/blackface.png"
                flower="/pingwing.png"
            />
            <ProductCategorySlider />
            <CustomProduct
                title="Makeup Product"
                subtitle="Best Product"
                description="We are here to help our most popular product will help you to create best look"
                bigimg="/woman.png"
                flower="/whiteflower.png"
            />
            <Footer />
        </div>
    );
}
