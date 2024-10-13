import Wishlist from "@/components/Wishlist";
import AsyncNavBar from "@/components/AsyncNavBar";
export const metadata = {
    title: "Wishlist",
    description: "Add your favorite products to the wishlist!",
    openGraph: {
        title: "Wishlist",
        description: "Add your favorite products to the wishlist",
    },
};
export default function WishlistPage() {
    return (
        <>
            <AsyncNavBar />
            <Wishlist />
        </>
    )
}