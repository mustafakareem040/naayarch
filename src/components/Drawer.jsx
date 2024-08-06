'use client'

import React, { useEffect } from 'react';
import Image from 'next/image';

const MenuItem = ({ label, hasChildren }) => (
    <div className="py-2">
        <div className="flex justify-between items-center">
            <span className="font-serif text-xl">{label}</span>
            {hasChildren && <Image src="/navigate.svg" alt="Expand" width={24} height={24} />}
        </div>
    </div>
);

const Drawer = ({ isOpen, onClose }) => {
    useEffect(() => {
        document.body.style.overflow = isOpen ? 'hidden' : 'unset';
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    return (
        <>
            {isOpen && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
            )}

            <div
                className={`fixed overflow-y-scroll left-0 h-full w-80 bg-white z-40 transform transition-transform duration-300 ease-in-out ${
                    isOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="p-6"> {/* Increased top padding to accommodate the navbar */}
                    <div className="space-y-4 pt-12">
                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Product</h2>
                            <MenuItem label="Face Care" hasChildren/>
                            <MenuItem label="Body Care" hasChildren/>
                            <MenuItem label="Hair Care" hasChildren/>
                            <MenuItem label="Eye Care" hasChildren/>
                            <MenuItem label="Lip Care" hasChildren/>
                            <MenuItem label="Hand Care" hasChildren/>
                            <MenuItem label="Makeup" hasChildren/>
                            <MenuItem label="Perfume" hasChildren/>
                            <MenuItem label="Kit" hasChildren/>
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Brand</h2>
                            <MenuItem label="Korean Brand" hasChildren/>
                            <MenuItem label="Global Brand" hasChildren/>
                        </div>

                        <div>
                            <h2 className="font-sans font-medium text-[1.775rem] mb-2">Account</h2>
                            <div className="flex items-center space-x-2">
                                <Image src={"/profile.svg"} alt={"Profile"} width={24} height={24}/>
                                <MenuItem label="Profile" hasChildren={false}/>
                            </div>
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
                                <Image src="/checkmark.svg" alt="Selected" width={16} height={16} className="ml-auto"/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Drawer;