'use client'
import React, { useState } from 'react';
import { Heart, ArrowLeft, ShoppingBag, Minus, Plus } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from "next/image";

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
        customPaging: (i) => (
            <div className="w-3 h-3 bg-[#D9D9D9] rounded-full mx-1 hover:bg-[#695C5C]" />
        ),
    };

    return (
        <div className="flex flex-col -mt-4 bg-white -mx-4">
            <div className="relative">
                <Slider {...sliderSettings} className="w-full mb-4">
                    {images.map((image, index) => (
                        <div key={index} className="relative aspect-[430/437] w-full">
                            <Image
                                src={image || '/placeholder-image.jpg'}
                                alt={`Product image ${index + 1}`}
                                fill={true}
                                className="object-cover"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </Slider>
                <ArrowLeft className="w-6 h-6 absolute top-4 left-4 z-10 text-[#3B5345]" />
                <Heart className="w-6 h-6 absolute top-4 right-4 z-10 text-[#3B5345] hover:text-[#C91C1C] fill-current" />
            </div>

            <div className="flex-grow bg-white rounded-t-[29px] shadow-[0px_-4px_8px_3px_rgba(105,92,92,0.1)] p-6 -mt-6 relative z-20">
                <div className="w-9 h-1 bg-black opacity-70 rounded-full mx-auto mb-6" />
                <h1 className="text-2xl font-medium mb-4">{title}</h1>
                <div className="mb-6">
                    <select
                        value={selectedSize}
                        onChange={(e) => setSelectedSize(e.target.value)}
                        className="w-32 p-2 border border-[#E5E7EB] rounded-lg text-base font-medium bg-[#F9FAFB]"
                    >
                        {sizes.map((size) => (
                            <option key={size} value={size}>
                                Size: {size}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Color</h2>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                        {colors.map((color, index) => (
                            <div key={index} className="flex flex-col items-center">
                                <button
                                    className={`w-20 h-20 rounded-full border-2 ${selectedColor === color ? 'border-[#3B5345]' : 'border-[#695C5C] border-opacity-50'} mb-2 overflow-hidden`}
                                    onClick={() => setSelectedColor(color)}
                                >
                                    <Image
                                        src={color.image || '/placeholder-color.jpg'}
                                        alt={color.name}
                                        width={80}
                                        height={80}
                                        className="object-cover"
                                    />
                                </button>
                                <span className="text-sm">{color.name}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="mb-6">
                    <h2 className="text-lg font-medium mb-2">Description</h2>
                    <p className="text-base">{description}</p>
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-medium">{price} IQD</span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                        >
                            <Minus className="w-4 h-4 text-[#3B5345]" />
                        </button>
                        <span className="text-lg font-medium">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                        >
                            <Plus className="w-4 h-4 text-[#3B5345]" />
                        </button>
                    </div>
                </div>

                <button className="w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5 mr-2" />
                    Add To Cart
                </button>
            </div>
        </div>
    );
}