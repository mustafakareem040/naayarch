'use client'
import React, { useRef, useState } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from "next/link";

const ProductCategorySlider = () => {
    const sliderRef = useRef(null);
    const [loadedImages, setLoadedImages] = useState({});

    const products = [
        {
            id: 1,
            title: 'Korean Products',
            image: 'https://storage.naayiq.com/resources/korean.webp',
            description: 'Providing our customers with the best Korean Skincare!',
            link: "/products?b=10&title=Korean Products"
        },
        {
            id: 2,
            title: 'Global Products',
            image: 'https://storage.naayiq.com/resources/global.webp',
            description: 'Discover the best skincare around the world!',
            link: "/products?b=11&title=Global Products"
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
        <div className="flex mb-12 pt-16 flex-col justify-center items-center p-4 gap-6 w-full h-auto bg-[#F6F3F17F] rounded-lg relative">
            <Slider {...settings} ref={sliderRef} className="relative bottom-12 w-full">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col justify-center items-center">
                        <div className="flex flex-col gap-6 justify-center items-center">
                            <h1 className="text-[#201E1C] font-sans font-medium text-center w-full text-3xl mb-6">{product.title}</h1>
                            <div className="w-full h-[364px] relative">
                                {!loadedImages[product.id] && (
                                    <div className="absolute inset-0 bg-gray-200 animate-pulse rounded-md" />
                                )}
                                <Image
                                    src={product.image}
                                    alt={product.title}
                                    fill={true}
                                    unoptimized={true}
                                    className={`object-cover rounded-md ${!loadedImages[product.id] ? 'invisible' : ''}`}
                                    onLoad={() => handleImageLoad(product.id)}
                                />
                            </div>
                            <p className="font-serif text-2xl mb-6">{product.description}</p>
                        </div>
                        <Link
                            prefetch={false}
                            className="w-full inline-block py-1 mb-6 text-center border-solid border-[1px] border-[#695C5C] rounded-full bg-transparent font-serif text-2xl"
                            href={product.link}
                        >
                            <span className="w-full inline-block">Show More</span>
                        </Link>
                    </div>
                ))}
            </Slider>
            <button
                onClick={handleNext}
                className="absolute font-serif text-xl bottom-[40%] right-6 px-2 py-2 little-white border border-[#695C5C] rounded-[20px]"
            >
                <span>Swipe </span>
                <Image src="https://storage.naayiq.com/resources/nextArrow.svg" unoptimized={true} alt="next" width={24} height={24} className="inline"/>
            </button>
        </div>
    );
};

export default ProductCategorySlider;