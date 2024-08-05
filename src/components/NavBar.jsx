'use client'

import Image from "next/image";

const ImageButton = ({ src, alt, onClick }) => (
    <button
        onClick={onClick}
        className="hover:bg-gray-100 rounded-full transition-colors"
    >
        <Image src={src} alt={alt} width={32} height={32} />
    </button>
);

export function NavBar() {
    const handleClick = (action) => {
        console.log(`${action} clicked`);
    };

    return (
        <nav className="flex items-center mb-6 justify-between">
            <ImageButton src="/menu.svg" alt="Menu" onClick={() => handleClick('Menu')} />
            <Image
                src="/logo.svg"
                alt="Logo"
                width={53}
                height={37}
                className="absolute left-1/2 transform -translate-x-1/2"
            />
            <div className="flex gap-2">
                <ImageButton src="/search.svg" alt="Search" onClick={() => handleClick('Search')} />
                <ImageButton src="/heart.svg" alt="Favorites" onClick={() => handleClick('Favorites')} />
                <ImageButton src="/shop.svg" alt="Cart" onClick={() => handleClick('Cart')} />
            </div>
        </nav>
    );
}