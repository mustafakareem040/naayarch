// components/AsyncNavBar.jsx
import { Suspense } from "react";
import { NavBar } from "@/components/NavBar";
import Skeleton from "react-loading-skeleton";
import 'react-loading-skeleton/dist/skeleton.css';
import React from "react"
// Optimized fetch function with caching and revalidation
const fetchWithRevalidate = async (url) => {
    const res = await fetch(url, {
        headers: {
            'Content-Type': "application/json"
        },
        next: { revalidate: 14400 }, // Revalidate every 60 seconds
    });
    if (!res.ok) {
        throw new Error(`Failed to fetch data from ${url}`);
    }
    return res.json();
};

// Data fetching functions
const fetchCategories = () => fetchWithRevalidate(`${process.env.NEXT_PUBLIC_API}/categories`);
const fetchSubcategories = () => fetchWithRevalidate(`${process.env.NEXT_PUBLIC_API}/subcategories`);

// Memoized Skeleton Component (Client Component)
const NavBarSkeleton = React.memo(function NavBarSkeleton() {
    return (
        <nav className="flex items-center justify-between p-5 bg-white absolute top-0 left-0 right-0 z-50">
            <Skeleton circle width={32} height={32} />
            <div className="absolute left-1/2 transform -translate-x-1/2">
                <Skeleton width={53} height={37} />
            </div>
            <div className="flex items-center space-x-2">
                <Skeleton circle width={32} height={32} />
                <Skeleton circle width={32} height={32} />
                <Skeleton circle width={32} height={32} />
            </div>
        </nav>
    );
});

// Async function to fetch and render NavBar content
async function AsyncNavBarContent({ bg }) {
    const [categories, subCategories] = await Promise.all([
        fetchCategories(),
        fetchSubcategories()
    ]);
    const background = bg || "#FFFFFF";
    return <NavBar bg={background} categories={categories} subCategories={subCategories} />;
}

// Main AsyncNavBar Component
const AsyncNavBar = ({ bg }) => {
    return (
        <Suspense fallback={<NavBarSkeleton />}>
            <AsyncNavBarContent bg={bg} />
        </Suspense>
    );
};

export default AsyncNavBar;