import Dashboard from "@/components/Dashboard";
import { SpeedInsights } from "@vercel/speed-insights/next"
import SearchComponent from "@/components/SearchComponent";
import Products from "@/components/Products";
import AsyncProducts from "@/components/AsyncProducts";
import ProductDetail from "@/components/ProductDetail";

export default function Home() {
    return (
        // <Dashboard />
        <ProductDetail title={"Test"} sizes={["lg", "xl", "2xl"]} colors={["red", "green", "blue"]}
                       price={"25000"} description={"test"} images={["/face.png", "/car.png", "/cream.png"]} />
  );
}
