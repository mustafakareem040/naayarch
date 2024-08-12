import { Suspense } from "react";
import { NavBar } from "@/components/NavBar";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export async function fetchCategories() {
    const res = await fetch('https://nay-backend.vercel.app/api/categories');
    if (!res.ok) {
        throw new Error('Failed to fetch categories');
    }
    return res.json();
}

export async function fetchSubcategories() {
    const res = await fetch('https://nay-backend.vercel.app/api/subcategories');
    if (!res.ok) {
        throw new Error('Failed to fetch subcategories');
    }
    return res.json();
}

function NavBarSkeleton() {
    return (
        <nav className="flex items-center justify-between p-5 bg-white absolute top-0 left-0 right-0 z-50">
            <Skeleton circle width={32} height={32} />
            <Skeleton className="rounded-full" width={53} height={37} />
            <div className="flex items-center space-x-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton circle width={32} height={32} />
                <Skeleton circle width={32} height={32} />
            </div>
        </nav>
    );
}

export default function AsyncNavBar() {
    return (
        <Suspense fallback={<NavBarSkeleton />}>
            <AsyncNavBarContent />
        </Suspense>
    );
}

async function AsyncNavBarContent() {
    const categories = await fetchCategories();
    const subCategories = await fetchSubcategories();
    return <NavBar categories={categories} subCategories={subCategories} />;
}