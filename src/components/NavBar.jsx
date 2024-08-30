'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Drawer from './Drawer';
import Link from "next/link";
import {useRouter} from "next/navigation";

const ImageButton = ({ src, alt, dest, isClose = false }) => (
    <Link
        href={dest}
        className={`rounded-full transition-colors ${isClose ? '' : 'hover:bg-gray-100'}`}>
        <Image src={src} alt={alt} width={32} height={32} />
    </Link>
);

const ImageCloseButton = ({ src, alt, onClick, isClose = false }) => (
    <button
        onClick={onClick}
        className={`rounded-full transition-colors ${isClose ? '' : 'hover:bg-gray-100'}`}>
        <Image src={src} alt={alt} width={32} height={32} />
    </button>
);

export function NavBar({ bg = "#FFFFFF", categories, subCategories }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleClick = (action) => {
        console.log(`${action} clicked`);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };
    const router = useRouter()
    return (
        <>
            <nav className={`flex items-center justify-between p-5 bg-[${bg}] absolute top-0 left-0 right-0 z-50`}>
                <ImageCloseButton
                    src={isDrawerOpen ? "/close.svg" : "/menu.svg"}
                    alt={isDrawerOpen ? "Close Menu" : "Open Menu"}
                    onClick={toggleDrawer}
                    isClose={true}
                />
                <Link className="absolute z-50 left-1/2 transform -translate-x-1/2" href="/">
                    <Image src="/logo.svg" alt="Nay Logo" width={53} height={37} />
                </Link>
                <div className="flex items-center space-x-2">
                    <ImageButton src="/search.svg" alt="Search" dest={"/"} />
                    <ImageButton src="/heart.svg" alt="Favorites" dest={"/"} />
                    <ImageButton src="/shop.svg" alt="Cart"  dest={"/cart"}/>
                </div>
            </nav>
            <Drawer categories={categories} subcategories={subCategories} isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
}