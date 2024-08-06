'use client'
import React, { useState } from 'react';
import Image from 'next/image';
import Drawer from './Drawer';

const ImageButton = ({ src, alt, onClick, isClose = false }) => (
    <button
        onClick={onClick}
        className={`rounded-full transition-colors ${isClose ? '' : 'hover:bg-gray-100'}`}>
        <Image src={src} alt={alt} width={32} height={32} />
    </button>
);

export function NavBar() {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const handleClick = (action) => {
        console.log(`${action} clicked`);
    };

    const toggleDrawer = () => {
        setIsDrawerOpen(!isDrawerOpen);
    };

    return (
        <>
            <nav className="flex items-center justify-between p-5 bg-white absolute top-0 left-0 right-0 z-50">
                <ImageButton
                    src={isDrawerOpen ? "/close.svg" : "/menu.svg"}
                    alt={isDrawerOpen ? "Close Menu" : "Open Menu"}
                    onClick={toggleDrawer}
                    isClose={true}
                />
                <div className="absolute z-50 left-1/2 transform -translate-x-1/2">
                    <Image src="/logo.svg" alt="Nay Logo" width={53} height={37} />
                </div>
                <div className="flex items-center space-x-2">
                    <ImageButton src="/search.svg" alt="Search" onClick={() => handleClick('Search')} />
                    <ImageButton src="/heart.svg" alt="Favorites" onClick={() => handleClick('Favorites')} />
                    <ImageButton src="/shop.svg" alt="Cart" onClick={() => handleClick('Cart')} />
                </div>
            </nav>
            <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        </>
    );
}