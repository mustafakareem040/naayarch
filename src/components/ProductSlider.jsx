'use client'
import React, { useRef } from 'react';
import Slider from 'react-slick';
import Image from 'next/image';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const ProductSlider = () => {
    const sliderRef = useRef(null);

    const products = [
        {
            id: 1,
            title: 'Beauty of Joseon\n Sunscreen',
            image: '/cream.png',
            price: '25.00 IQD',
        },
        {
            id: 2,
            title: 'A test cream',
            image: '/korean.jpeg',
            price: '0.00 IQD',
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

    return (
        <div className="flex mb-12 pt-16 flex-col justify-center items-center gap-6 w-full h-auto bg-opacity-50 bg-[#F6F3F1] rounded-lg relative">
            <div className="flex justify-between mb-6 items-center w-[95%]">
                <h1 className="text-[#201E1C] font-sans font-medium text-[2.625rem] mb-6">Best Seller</h1>
                <p className="text-[#3B5345] font-serif text-xl font-medium ">Show all</p>
            </div>
            <Slider {...settings} ref={sliderRef} className="relative bottom-12 w-full">
                {products.map((product) => (
                    <div key={product.id} className="flex flex-col justify-center items-center">
                        <div className="flex flex-col gap-4 justify-center items-center">
                            <Image src={product.image} alt={product.title} width={364} height={364}
                                   className="object-cover min-h-[400px] rounded-md w-full"/>
                            <div className="flex text-2xl  leading-5 font-medium font-serif justify-between w-full items-center">
                                <h2 className="mt-4 min-h-12 ml-2 max-w-52">{product.title}</h2>
                                <p className="mt-2 min-h-12 self-end">{product.price}</p>
                            </div>
                            <button
                                className="w-full mb-6 py-1 mt-4 rounded-full font-serif text-2xl bg-[#3B5345] text-white">
                                Add To Cart
                            </button>
                        </div>
                    </div>
                ))}

            </Slider>
            <button
                onClick={handleNext}
                className="absolute bottom-[40%] right-2 px-2 py-2 bg-white bg-opacity-50 border border-gray-600 rounded-full"
            >
                <span>Swap </span>
                <Image src="/nextArrow.svg" alt={"next"} width={24} height={24}
                       className="inline"/>
            </button>


        </div>
    );
};

export default ProductSlider;
