'use client'
import React, { useState, useCallback, memo } from 'react';
import Image from 'next/image';
import Link from "next/link";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
const Drawer = dynamic(() => import('./Drawer'), { ssr: false });


const ImageButton = memo(function ImageButton({ src, alt, dest, isClose = false }) {
    return (
        <Link
            href={dest}
            className={`rounded-full transition-colors ${isClose ? '' : 'hover:bg-gray-100'}`}>
            <Image src={src} alt={alt} width={32} height={32} unoptimized={true} />
        </Link>
    );
});

const ImageCloseButton = memo(function ImageCloseButton({ src, alt, onClick, isClose = false }) {
    return (
        <button
            onClick={onClick}
            className={`rounded-full transition-colors ${isClose ? '' : 'hover:bg-gray-100'}`}>
            <Image src={src} alt={alt} width={32} height={32} />
        </button>
    );
});

export const NavBar = memo(function NavBar({ bg = "#FFFFFF", categories, subCategories }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setIsDrawerOpen(prev => !prev);
    }, []);

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    const router = useRouter();

    return (
        <>
            <nav className="flex items-center z-30 justify-between p-5 absolute top-0 left-0 right-0"
                 style={{backgroundColor: bg}}>
                <ImageCloseButton
                    src={isDrawerOpen ? "https://storage.naayiq.com/resources/close.svg" : "https://storage.naayiq.com/resources/menu.svg"}
                    alt={isDrawerOpen ? "Close Menu" : "Open Menu"}
                    onClick={toggleDrawer}
                    isClose={true}
                />
                <Link className="absolute z-30 left-1/2 transform -translate-x-1/2" href="/">
                    <Image src="https://storage.naayiq.com/resources/logo.svg" alt="Naay Logo" unoptimized={true} width={53} height={37} />
                </Link>
                <div className="flex items-center space-x-2">
                    <ImageButton src="https://storage.naayiq.com/resources/search.svg" alt="Search" dest={"/products"} />
                    <ImageButton src="https://storage.naayiq.com/resources/heart.svg" alt="Favorites" dest={"/wishlist"} />
                    <ImageButton src="https://storage.naayiq.com/resources/shop.svg" alt="Cart"  dest={"/cart"}/>
                </div>
            </nav>
            <Drawer categories={categories} subcategories={subCategories} isOpen={isDrawerOpen} onClose={closeDrawer} />
        </>
    );
});