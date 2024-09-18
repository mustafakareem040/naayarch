'use client'
import React, { useRef, useState } from 'react';
import dynamic from 'next/dynamic';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
const Slider = dynamic(() => import('react-slick'), { ssr: false });
import Image from 'next/image';
import Link from "next/link";

const ProductSlider = () => {
    const sliderRef = useRef(null);
    const [loadedImages, setLoadedImages] = useState({});

    const products = [
        {
            id: 1,
            title: 'Beauty of Joseon\n Sunscreen',
            image: 'https://storage.naayiq.com/resources/cream.webp',
            price: '20.00 IQD',
            href: 181,
        },
        {
            id: 2,
            title: 'Foaming Cream',
            image: 'https://storage.naayiq.com/resources/korean2.webp',
            price: '35.000 IQD',
            href: 680
        },
    ];

    const settings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
    };

    const handleNext = () => {
        sliderRef.current.slickNext();
    };

    const handleImageLoad = (id) => {
        setLoadedImages(prev => ({ ...prev, [id]: true }));
    };

    return (
        <>
            <div className="flex mb-12 p-4 flex-col justify-center items-center gap-6 w-full h-auto bg-[#F6F3F17F] rounded-lg relative">
                <div className="flex justify-between mb-6 items-center w-[95%]">
                    <h1 className="text-[#201E1C] font-sans font-medium text-3xl mb-6">Best Seller</h1>
                    <Link prefetch={false} href={"/products??sortBy=Best+Selling"} className="text-[#3B5345] font-serif text-xl font-medium">Show all</Link>
                </div>
                <Slider {...settings} ref={sliderRef} className="relative bottom-12 w-full">
                    {products.map((product) => (
                        <div key={product.id} className="flex flex-col justify-center items-center">
                            <div className="flex flex-col gap-4 justify-center items-center w-full">
                                <div className="w-full h-[400px] relative">
                                    {!loadedImages[product.id] && (
                                        <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-lg" />
                                    )}
                                    <Image
                                        src={product.image}
                                        alt={product.title}
                                        fill={true}
                                        unoptimized={true}
                                        className={`object-cover rounded-lg ${!loadedImages[product.id] ? 'invisible' : ''}`}
                                        onLoad={() => handleImageLoad(product.id)}
                                    />
                                </div>
                                <div className="flex text-2xl leading-5 font-medium font-serif justify-between w-full items-center">
                                    <h2 className="mt-4 min-h-12 ml-2 max-w-52">{product.title}</h2>
                                    <p className="mt-2 min-h-12 self-end">{product.price}</p>
                                </div>
                                <Link
                                    href={`/products/${product.href}`}
                                    className="w-full text-center mb-6 py-1 mt-4 rounded-full font-serif text-2xl bg-[#3B5345] text-white">
                                    Add To Cart
                                </Link>
                            </div>
                        </div>
                    ))}
                </Slider>
                <button
                    onClick={handleNext}
                    className="absolute font-serif text-xl little-white bottom-[40%] right-6 px-2 py-2 border border-[#695C5C] rounded-[20px]"
                >
                    <span>Swipe </span>
                    <Image src="https://storage.naayiq.com/resources/nextArrow.svg" unoptimized={true} alt="next" width={24} height={24} className="inline"/>
                </button>
            </div>
            <div className="absolute transform -translate-y-14 left-4">
                <svg width="35" height="35" viewBox="0 0 46 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                        d="M21.0413 2.48763C21.4805 0.360124 24.5195 0.360135 24.9587 2.48765L27.8676 16.5781C28.029 17.36 28.64 17.971 29.4219 18.1324L43.5124 21.0413C45.6399 21.4805 45.6399 24.5195 43.5124 24.9587L29.4219 27.8676C28.64 28.029 28.029 28.64 27.8676 29.4219L24.9587 43.5124C24.5195 45.6399 21.4805 45.6399 21.0413 43.5124L18.1324 29.4219C17.971 28.64 17.36 28.029 16.5781 27.8676L2.48763 24.9587C0.360124 24.5195 0.360135 21.4805 2.48765 21.0413L16.5781 18.1324C17.36 17.971 17.971 17.36 18.1324 16.5781L21.0413 2.48763Z"
                        fill="#4F463D"/>
                </svg>
            </div>
        </>
    );
};

export default ProductSlider;