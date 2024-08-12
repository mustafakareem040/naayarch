import React from 'react';
import Image from 'next/image';

const Footer = () => {
    return (
        <footer className="flex mt-36 flex-col justify-end items-center px-4 sm:px-8 pt-16 pb-8 w-full mx-auto bg-[#F6F3F1] rounded-lg">
            <div className="mb-8">
                <Image
                    src="/logo_with_backgorund.svg"
                    alt="Nay Iraq Logo"
                    width={120}
                    height={120}
                    className="rounded-lg"
                />
            </div>

            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <a href="#" className="text-gray-600 hover:text-gray-800">About us</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Shop</a>
                <a href="#" className="text-gray-600 hover:text-gray-800">Follow us</a>
            </div>

            <div className="text-sm text-gray-500">
                Copyright © 2024 NayIraq
            </div>
        </footer>
    );
};

export default Footer;