import AsyncNavBar from "@/components/AsyncNavBar";
import ProductSearchComponent from "@/components/ProductSearchComponent";
export const metadata = {
    title: "Search",
    description: "Search for premium beauty products from Korean and global brands at Naay. Your trusted source for skincare, makeup, and body care in Iraq!",
    openGraph: {
        title: "Search",
        description: "Search for premium beauty products from Korean and global brands at Naay. Your trusted source for skincare, makeup, and body care in Iraq",
    },
};
export default function SearchPage() {
    return( <>
        <AsyncNavBar />
        <ProductSearchComponent />
    </>)
}