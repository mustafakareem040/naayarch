import Wishlist from "@/components/Wishlist";
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
        <Wishlist />
    )
}