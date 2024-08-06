import Image from "next/image";
import {NavBar} from "@/components/NavBar";
import Hero from "@/components/Hero";
import CustomProduct from "@/components/CustomProduct";
import SaleBanner from "@/components/SaleBanner";
import {ProductWithSales} from "@/components/ProductWithSales";
import ProductSlider from "@/components/ProductSlider";
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import ProductCategorySlider from "@/components/ProductCategorySlider";
import Footer from "@/components/Footer";
export default function Home() {
    return (
    <>
        <NavBar />
        <Hero />
        <ProductWithSales />
        <ProductSlider />
        <CustomProduct
            title="Our New Products"
            subtitle="Fenty Lipgloss"
            description="The ultimate
 lip gloss with  shine
 that feels as good as it looks."
            bigimg="/blackface.png"
            flower="/pingwing.png"
        />
        <ProductCategorySlider />
        <CustomProduct
            title="Makeup Product"
            subtitle="Best Product"
            description="We are here to help
our most popular product will help
you to create best look"
            bigimg="/woman.png"
            flower="/whiteflower.png"
        />
        <Footer />
    </>
  );
}
