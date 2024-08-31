'use client'
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from "next/link";
import Cookies from 'js-cookie';

const MenuItem = ({ label, hasChildren, onClick }) => (
    <div className="py-2" onClick={onClick}>
        <div className="flex justify-between items-center">
            <span className="font-serif text-xl">{label}</span>
            {hasChildren && <Image src="/navigate.svg" alt="Expand" width={24} height={24} />}
        </div>
    </div>
);

const SubcategoryView = ({ category, subcategories, onBack, isVisible }) => (
    <div className={`p-6 pt-20 absolute top-0 left-0 w-full h-full bg-white transition-transform duration-300 ease-out transform ${isVisible ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center mb-6">
            <button onClick={onBack} className="mr-4">
                <Image src="/arrow-left.svg" alt="Back" width={40} height={40} />
            </button>
            <h2 className="font-sans font-medium text-[1.775rem]">{category}</h2>
        </div>
        <div className="grid grid-cols-2 justify-center text-center items-center gap-4">
            {subcategories.map((item) => (
                <Link key={item.id} className="border border-[#3B5345] rounded-lg h-[4rem] flex justify-center items-center px-1" href={`/products?sc=${item.id}`}>
                    <span className="font-serif text-[#545454] text-base">{item.name}</span>
                </Link>
            ))}
        </div>
    </div>
);

const Drawer = ({ categories, subcategories, isOpen, onClose }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentView, setCurrentView] = useState('main');
    const [selectedCategory, setSelectedCategory] = useState('');

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

    const handleCategoryClick = (category) => {
        setSelectedCategory(category);
        setCurrentView('subcategory');
    };

    const handleBackClick = () => {
        setCurrentView('main');
    };

    const productCategories = categories.filter(category => !category.is_brand);
    const brandCategories = categories.filter(category => category.is_brand);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            )}

            <div
                className={`fixed overflow-y-scroll top-0 left-0 h-full w-80 bg-white z-40 transform transition-transform duration-300 ease-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6 pt-20 relative">
                    <div className="space-y-4">
                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Product</h2>
                            {productCategories.map(category => (
                                <div key={category.id} className="py-2">
                                    <div className="flex justify-between items-center">
                                        <Link className="font-serif text-xl" href={`/products?c=${category.id}`}>{category.name}</Link>
                                        {!category.is_brand &&
                                            <Image onClick={() => handleCategoryClick(category.name)}
                                                   src="/navigate.svg" alt="Expand" width={24} height={24}/>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Brand</h2>
                            {brandCategories.map(category => (
                                <div key={category.id} className="py-2">
                                    <div className="flex justify-between items-center">
                                        <Link className="font-serif text-xl"
                                              href={`/products?c=${category.id}`}>{category.name}</Link>
                                        <Image onClick={() => handleCategoryClick(category.name)}
                                                   src="/navigate.svg" alt="Expand" width={24} height={24}/>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Account</h2>
                            {isLoggedIn ? (
                                <Link className="flex items-center space-x-2" href="/profile">
                                    <Image src={"/profile.svg"} alt={"Profile"} width={24} height={24}/>
                                    <MenuItem label="Profile" hasChildren={false}/>
                                </Link>
                            ) : (
                                <Link className="flex items-center space-x-2" href="/login">
                                    <Image src={"/login.svg"} alt={"Login"} width={24} height={24}/>
                                    <MenuItem label="Login" hasChildren={false}/>
                                </Link>
                            )}
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Language</h2>
                            <div className="flex items-center space-x-3 mb-6 ">
                                <Image src="/ar.svg" alt="Arabic" width={24} height={24}/>
                                <span className="font-serif text-xl">Arabic</span>
                            </div>
                            <div className="flex items-center space-x-3">
                                <Image src="/en.svg" alt="English" width={24} height={24}/>
                                <span className="font-serif text-xl">English</span>
                                <Image src="/checkmark.svg" alt="Selected" width={20} height={20} className="ml-auto"/>
                            </div>
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
};

export default Drawer;