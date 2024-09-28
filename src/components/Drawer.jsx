'use client'
import React, {useEffect, useState, useCallback, memo, useRef} from 'react';
import Image from 'next/image';
import Link from "next/link";
import Cookies from 'js-cookie';
import {CircleArrowRight, CircleArrowLeft, Check} from "lucide-react";
import {usePathname} from "next/navigation";
const MenuItem = memo(function MenuItem({ label, hasChildren, onClick }) {
    return (
        <div className="py-2" onClick={onClick}>
            <div className="flex justify-between items-center">
                <span className="font-serif text-xl">{label}</span>
                {hasChildren && <CircleArrowRight size={26} strokeWidth={1.5} className="stroke-[#3B5345] text-[#3B5345]"/>}
            </div>
        </div>
    );
});

const SubcategoryView = memo(function SubcategoryView({ category, subcategories, onBack, isVisible }) {
    return (
        <div className={`p-6 pt-20 fixed inset-0 top-0 left-0 w-full h-full max-h-screen overflow-y-auto bg-white transition-transform duration-300 ease-out transform ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
            <div className="flex items-center mb-6">
                <button onClick={onBack} className="mr-4">
                    <CircleArrowLeft size={40} strokeWidth={0.7} />
                </button>
                <h2 className="font-sans font-medium text-[1.775rem]">{category}</h2>
            </div>
            <div className="grid grid-cols-2 justify-center text-center items-center gap-4">
                {subcategories.map((item) => (
                    <Link prefetch={false} key={item.id} className="border border-[#3B5345] rounded-lg h-[4rem] flex justify-center leading-none items-center px-1" href={`/products?sc=${item.id}&title=${item.name}`}>
                        <span className="font-serif text-[#545454] text-base">{item.name}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
});

const Drawer = memo(function Drawer({ categories, subcategories, isOpen, onClose }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [selectedCategory, setSelectedCategory] = useState('');
    const drawerRef = useRef(null);
    const categoryRef = useRef(null);
    const [currentLanguage, setCurrentLanguage] = useState('en');
    const [enPath, setEnPath] = useState('/en');
    const [arPath, setArPath] = useState('/ar');
    const pathname = usePathname();

    useEffect(() => {
        const pathParts = pathname.split('/');
        const langFromPath = pathParts[1];

        if (langFromPath === 'en' || langFromPath === 'ar') {
            setCurrentLanguage(langFromPath);
            const restOfPath = '/' + pathParts.slice(2).join('/');
            setEnPath('/en' + restOfPath);
            setArPath('/ar' + restOfPath);
        }
    }, [pathname]);
    useEffect(() => {
        const checkLoginStatus = () => {
            const accessToken = Cookies.get('token');
            setIsLoggedIn(!!accessToken);
        };

        checkLoginStatus();

        document.body.style.overflow = isOpen ? 'hidden' : 'unset';

        if (!isOpen) {
            setCurrentView('main');
        }

        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);



    const handleCategoryClick = useCallback((category) => {
        setSelectedCategory(category);
        setCurrentView('subcategory');
        categoryRef.current.style.display = 'none'

    }, []);

    const handleBackClick = useCallback(() => {
        setCurrentView('main');
        categoryRef.current.style.display = 'block'
    }, []);

    const productCategories = categories.filter(category => !category.is_brand);
    const brandCategories = categories.filter(category => category.is_brand);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={function() {
                    categoryRef.current.style.display = 'block'
                    onClose()
                }} />
            )}

            <div
                className={`fixed overflow-y-scroll top-0 left-0 h-full w-80 bg-white z-40 transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
                ref={drawerRef}>
                <div className="p-6 pt-20 relative">
                    <div ref={categoryRef} className="space-y-4">
                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Product</h2>
                            {productCategories.map(category => (
                                <div key={category.id} className="py-2">
                                    <div className="flex justify-between items-center">
                                        <Link prefetch={false} className="font-serif text-xl" href={`/products?c=${category.id}&title=${category.name}`}>{category.name}</Link>
                                        {!category.is_brand &&
                                            <button onClick={() => handleCategoryClick(category.name)}>
                                                <CircleArrowRight size={26} strokeWidth={1.5} className="stroke-[#3B5345] text-[#3B5345]"/>
                                            </button>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Brand</h2>
                            {brandCategories.map(category => (
                                <div key={category.id} className="py-2">
                                    <div className="flex justify-between items-center">
                                        <Link prefetch={false} className="font-serif text-xl"
                                              href={`/products?b=${category.id}&title=${category.name}`}>{category.name}</Link>
                                        <button
                                            onClick={() => handleCategoryClick(category.name)}>
                                            <CircleArrowRight size={26} strokeWidth={1.5} className="stroke-[#3B5345] text-[#3B5345]"/>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Account</h2>
                            {isLoggedIn ? (
                                <Link prefetch={false} className="flex items-center space-x-2" href="/profile">
                                    <Image src={"https://storage.naayiq.com/resources/profile.svg"} unoptimized={true} alt={"Profile"} width={24} height={24}/>
                                    <MenuItem label="Profile" hasChildren={false}/>
                                </Link>
                            ) : (
                                <Link prefetch={false} className="flex items-center space-x-2" href="/login">
                                    <Image src={"https://storage.naayiq.com/resources/login.svg"} unoptimized={true} alt={"Login"} width={24} height={24}/>
                                    <MenuItem label="Login" hasChildren={false}/>
                                </Link>
                            )}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Language</h2>
                            <Link href={arPath} className="flex items-center space-x-3 mb-6 cursor-pointer">
                                <Image src="https://storage.naayiq.com/resources/ar.svg" unoptimized={true} alt="Arabic"
                                       width={24} height={24}/>
                                <span className="font-serif text-xl">Arabic</span>
                                {currentLanguage === 'ar' && <Check size={20} className="ml-auto"/>}
                            </Link>
                            <Link href={enPath} className="flex items-center space-x-3 cursor-pointer">
                                <Image src="https://storage.naayiq.com/resources/en.svg" unoptimized={true}
                                       alt="English" width={24} height={24}/>
                                <span className="font-serif text-xl">English</span>
                                {currentLanguage === 'en' && <Check size={20} className="ml-auto"/>}
                            </Link>
                        </div>
                    </div>

                    <SubcategoryView
                        category={selectedCategory}
                        subcategories={subcategories.filter(sub => sub.category_name === selectedCategory)}
                        onBack={handleBackClick}
                        isVisible={currentView === 'subcategory'}
                    />
                </div>
            </div>
        </>
    );
});

export default Drawer;
