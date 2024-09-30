'use client'
import React, { useState, useCallback, memo } from 'react';
import Link from "next/link";
import dynamic from "next/dynamic";
import {Heart, X} from "lucide-react";
import ShoppingBag from "@/components/ShoppingBag";
const Drawer = dynamic(() => import('./Drawer'), { ssr: false });



export const NavBar = memo(function NavBar({ bg = "#FFFFFF", categories, subCategories }) {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);

    const toggleDrawer = useCallback(() => {
        setIsDrawerOpen(prev => !prev);
    }, []);

    const closeDrawer = useCallback(() => {
        setIsDrawerOpen(false);
    }, []);

    return (
        <>
            <nav className="flex items-center z-[45] justify-between p-5 absolute top-0 left-0 right-0"
                 style={{backgroundColor: bg}}>
                <button
                    onClick={toggleDrawer}>
                    {isDrawerOpen ? <X size={30} strokeWidth={1.25}/> :
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
                        <path stroke="#181717" strokeLinecap="round" strokeWidth="1.5"
                              d="M4 9.33h24M4 16h21.33M4 22.67h18.67"/>
                    </svg>}
                </button>
                <Link className="absolute scale-90 z-30 left-1/2 transform -translate-x-1/2" href="/">
                    <svg xmlns="http://www.w3.org/2000/svg" width="70" height="40" fill="none">
                        <path fill="#181717"
                              d="M18 4v15.5l3.2 3.5h-6.6l3.1-3.3L3.7 3v16.5L7 23H.3l3.2-3.5v-17L1.8.7h5.5l10.4 12.7V4L14.5.6h6.7L18 4.1Zm2.8 13.6c0-3.2 2.6-5.6 5.7-5.6 2 0 2.7.6 3.3 1.2-.6-.8-2-2.6-4.5-2.6h-2.4c1.2-2.2 4.2-3.8 7-3.8 3 0 5.6 1.3 5.6 4.4V21l1.8 2h-6v-3.9c-1 2.8-3 4-5.1 4-3 0-5.4-2.4-5.4-5.5Zm6.2-7c1 .4 3.4 1.6 4.4 5.4V9.7c0-1.7-.5-2.5-1.5-2.5-1.6 0-2.5 1.8-2.9 3.4ZM24.6 16c0 2.5 2 5.3 4 5.3 1.9 0 2.7-1.8 2.7-3.6 0-2.3-1.7-5.3-4-5.3-1.7 0-2.7 1.7-2.7 3.6Zm13.1 1.7c0-3.2 2.6-5.6 5.7-5.6 2 0 2.7.6 3.3 1.2-.6-.8-2-2.6-4.5-2.6h-2.4c1.2-2.2 4.2-3.8 7-3.8 3 0 5.6 1.3 5.6 4.4V21l1.8 2h-6v-3.9c-1 2.8-3 4-5.1 4-3 0-5.4-2.4-5.4-5.5Zm6.2-7c1 .4 3.4 1.6 4.4 5.4V9.7c0-1.7-.5-2.5-1.5-2.5-1.6 0-2.5 1.8-2.9 3.4ZM41.6 16c0 2.5 1.8 5.3 4 5.3 1.8 0 2.6-1.8 2.6-3.6 0-2.3-1.7-5.3-4-5.3-1.7 0-2.6 1.7-2.6 3.6Zm24.8-5.2-2-3.7h5.4l-3.1 3.7-3.5 9.2v2.6H62c-1.8 3.9-4 7.2-7.2 7.2-2 0-3.5-1.3-3.5-2.9 0-1.5 1.1-2.8 3.3-3.3l5.3-1.1-5.6-13.5L52.6 7h7.8l-1.7 2L63 19.5l3.4-8.9Zm-9.5 12.6c-2.1.5-2.5 1.3-2.5 1.7 0 .8.8 1 1.4 1 2.2 0 4.6-1.6 6-3.5h-1.5l-3.4.8ZM26 37h-1v-8.4h1V37Zm7-.8h.1c0 .4-.8.8-1.1.8-2.2 0-2.3-3.8-3.8-3.8V37h-1v-8.4h2.2c1.8 0 2.7 1.4 2.7 2.6 0 1-.6 2-2 2h-1.2c1.6.6 2.6 3.3 3.6 3.3l.5-.3Zm-3.6-7.4h-.8c-.2 0-.4.2-.4.5V33h1.5c1 0 1.4-1 1.4-2 0-1.1-.5-2.2-1.7-2.2Zm9.8 8.2h-1l-.6-2.2c0 1.5-1.2 2.2-2.4 2.2-1 0-2-.6-2-1.7 0-1.9 2.8-4.1 2.8-5.8-.2-.4-.4-.5-.5-.5H35l-.1.1c.2-.4.4-.5.7-.5.5 0 1 .4 1.3 1.4l2.1 7Zm-5-2c0 1 .7 1.5 1.4 1.5.9 0 1.8-.7 1.8-1.9l-.1-.8L36 30V30c-.2 1.5-2 3.2-2 5.2Zm15.8 3h.2v.2c-1.2.6-2.2.9-2.9.9-2.1 0-3-2-5-2s-3-2.2-3-4.3c0-2.1 1-4.2 3-4.2 2.1 0 3.1 2 3.1 4.2 0 1.9-.8 3.8-2.4 4.2 1.9.3 3.6 1.5 5.3 1.5.6 0 1.1-.1 1.7-.4Zm-7.3-9.2c-1.6 0-2.4 2.5-2.4 4.6 0 1.8.5 3.4 1.7 3.4 1.6 0 2.4-2.5 2.4-4.7 0-1.7-.5-3.3-1.7-3.3Z"/>
                    </svg>
                </Link>
                <div className="flex items-center space-x-2">
                    <Link href={"/search"}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none">
                            <g stroke="#181717" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25"
                               clipPath="url(#a)">
                                <path d="M4 13.33a9.33 9.33 0 1 0 18.67 0 9.33 9.33 0 0 0-18.67 0ZM28 28l-8-8"/>
                            </g>
                            <defs>
                                <clipPath id="a">
                                    <path fill="#fff" d="M0 0h32v32H0z"/>
                                </clipPath>
                            </defs>
                        </svg>
                    </Link>
                    <Link href={"/wishlist"}>
                        <Heart size={32} strokeWidth={"1"}/>
                    </Link>
                    <Link href={"/cart"}>
                        <ShoppingBag/>
                    </Link>
                </div>
            </nav>
            <Drawer categories={categories} subcategories={subCategories} isOpen={isDrawerOpen} onClose={closeDrawer}/>
        </>
    );
});