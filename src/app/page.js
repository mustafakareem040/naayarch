import Dashboard from "@/components/Dashboard";
import { SpeedInsights } from "@vercel/speed-insights/next"
import SearchComponent from "@/components/SearchComponent";
import Products from "@/components/Products";
import AsyncProducts from "@/components/AsyncProducts";
import ProductDetail from "@/components/ProductDetail";

export default function Home() {
    return (
        <>
        {/*<SpeedInsights />*/}
            <AsyncProducts />
        {/*<ProductDetail images={["https://storage.naayiq.com/resources/1018.webp", "https://storage.naayiq.com/resources/1018.webp"]}*/}
        {/*               title={"All Products"}*/}
        {/*colors={["Red", "Green"]} description={"Test Description"} price={"25.00"} sizes={["sm", "md", "xl"]}/>*/}
            </>
  );
}
