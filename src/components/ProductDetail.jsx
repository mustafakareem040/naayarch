'use client'
import React, { useState } from 'react';
import { Heart, ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import Slider from 'react-slick';
import {Image} from 'antd';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function ProductDetail({ images, sizes, colors, title, description, price }) {
    const [selectedSize, setSelectedSize] = useState(sizes[0]);
    const [selectedColor, setSelectedColor] = useState(colors[0]);
    const [quantity, setQuantity] = useState(1);

    const sliderSettings = {
        dots: true,
        infinite: true,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: () => (
            <div className="w-3 h-3 bg-[#D9D9D9] rounded-full mx-1 focus:bg-[#695C5C]" />
        ),
    };

    return (
        <div className="flex flex-col min-h-screen bg-white rounded-[35px] shadow-[0px_60px_140px_rgba(31,31,31,0.1)]">
            <div className="relative">
                <div className="absolute top-4 left-4 z-10">
                    <ArrowLeft className="w-10 h-10 text-[#3B5345]" />
                </div>
                <div className="absolute top-4 right-4 z-10">
                    <Heart className="w-10 h-9 text-[#3B5345]" />
                </div>
                <Slider {...sliderSettings} className="w-full mb-4">
                    {images.map((image, index) => (
                        <div key={index} className="w-full">
                            <Image
                                src={image}
                                alt={`Product image ${index + 1}`}
                                fetchPriority={"high"}
                                className="w-full h-full"
                            />
                        </div>
                    ))}
                </Slider>
            </div>

            <div className="flex-grow bg-white rounded-t-[29px] shadow-[0px_-4px_8px_3px_rgba(105,92,92,0.1)] p-6">
                <div className="w-9 h-1.5 bg-black opacity-70 rounded-[11px] mx-auto mb-8" />

                <h1 className="text-2xl font-medium mb-4 font-['NN_Rektorat_STD']">{title}</h1>

                <div className="mb-6">
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-44 p-2 border border-[rgba(105,92,92,0.5)] rounded-lg text-xl font-medium font-['Figtree']"
                    >
                        {sizes.map((size) => (
                            <option key={size} value={size}>
                                Size: {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <h2 className="text-2xl font-medium mb-2 font-['NN_Rektorat_STD']">Description</h2>
                    <p className="text-xl font-['Figtree']">{description}</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-2xl font-medium font-['NN_Rektorat_STD']">{price} IQD</span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-13 h-11.5 flex items-center justify-center border border-[rgba(105,92,92,0.5)] rounded-lg"
                        >
                            <Minus className="w-6 h-6 text-[#695C5C]" />
                        </button>
                        <span className="text-2xl font-medium font-['NN_Rektorat_STD']">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-13 h-11.5 flex items-center justify-center border border-[rgba(105,92,92,0.5)] rounded-lg"
                        >
                            <Plus className="w-6 h-6 text-[#695C5C]" />
                        </button>
                    </div>
                </div>

                <button className="w-full bg-[#3B5345] text-white py-4 rounded-lg font-medium text-2xl font-['NN_Rektorat_STD'] flex items-center justify-center">
                    <ShoppingBag className="w-7 h-7 mr-6" />
                    Add To Cart
                </button>
            </div>
        </div>
    );
}