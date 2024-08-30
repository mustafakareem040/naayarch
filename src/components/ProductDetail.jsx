'use client'
import React, { useState, useEffect } from 'react';
import { Heart, Minus, Plus } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function ProductDetail({
                                          images,
                                          sizeNames,
                                          sizePrices,
                                          sizeQuantities,
                                          colorNames,
                                          colorPrices,
                                          colorQuantities,
                                          colorImages,
                                          title,
                                          description,
                                          price
                                      }) {
    const [selectedSize, setSelectedSize] = useState(sizeNames && sizeNames.length > 0 ? sizeNames[0] : null);
    const [selectedColor, setSelectedColor] = useState(colorNames && colorNames.length > 0 ? colorNames[0] : null);
    const [quantity, setQuantity] = useState(1);
    const [currentPrice, setCurrentPrice] = useState(price);
    const router = useRouter()

    useEffect(() => {
        if (selectedSize) {
            const sizeIndex = sizeNames.indexOf(selectedSize);
            setCurrentPrice(sizePrices[sizeIndex]);
        }
    }, [selectedSize, sizeNames, sizePrices]);

    const sliderSettings = {
        dots: true,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: function(i) {
            return (
                <div
                    style={{
                        width: '12px',
                        height: '12px',
                        background: i === this.currentSlide ? '#695C5C' : '#D9D9D9',
                        borderRadius: '50%',
                        padding: 0,
                        margin: '0 4px'
                    }}
                />
            );
        },
    };

    return (
        <div className="flex overflow-x-hidden font-sans font-medium flex-col -mt-5 -mx-4 bg-white">
            <Slider {...sliderSettings} className="w-full h-[35vh] mb-4">
                {images.map((image, index) => (
                    <div key={index} className="relative max-h-[40vh] aspect-[430/437] w-full">
                        <Image
                            src={image || '/noimage.png'}
                            alt={`Product image ${index + 1}`}
                            fill={true}
                            unoptimized={true}
                            className="object-cover max-h-[40vh]"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </Slider>
            <button className="absolute top-4 left-4 z-10" onClick={router.back}>
                <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
            </button>
            <Heart
                className="w-10 h-10 absolute top-4 right-4 z-10 text-transparent stroke-1 stroke-[#3B5345] hover:stroke-[#C91C1C] hover:text-[#C91C1C] fill-current"/>

            <div
                className="flex-grow bg-white rounded-t-xl shadow-[0px_-4px_8px_3px_rgba(105,92,92,0.1)] p-6 mt-2 relative z-30">
                <div className="w-9 h-1 bg-black opacity-70 rounded-full mx-auto mb-6"/>
                <h1 className="text-xl mb-1">{title}</h1>

                {sizeNames && sizeNames.length > 0 && (
                    <div className="mb-6 font-serif">
                        {sizeNames.length === 1 ? (
                            <div
                                className="w-32 p-2 border border-[#E5E7EB] rounded-lg bg-white">
                                Size: {sizeNames[0]}
                            </div>
                        ) : (
                            <select
                                value={selectedSize}
                                onChange={(e) => setSelectedSize(e.target.value)}
                                className="w-32 p-2 border border-[#E5E7EB] rounded-lg font-serif bg-white"
                            >
                                {sizeNames.map((size, index) => (
                                    <option className="text-xs" key={size} value={size}>
                                        Size: {size}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>
                )}

                {colorNames && colorNames.length > 0 && (
                    <div className="mb-10 mt-6">
                        <h2 className="text-xl font-medium mb-2">Color</h2>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {colorNames.map((color, index) => (
                                <div key={index} className="flex flex-col items-center">
                                    <button
                                        className={`w-20 h-20 rounded-full border-2 ${selectedColor === color ? 'border-[#3B5345]' : 'border-[#695C5C] border-opacity-50'} mb-2 overflow-hidden`}
                                        onClick={() => setSelectedColor(color)}
                                    >
                                        {colorImages[index] && (
                                            <Image
                                                src={colorImages[index]}
                                                alt={color}
                                                width={80}
                                                height={80}
                                                className="object-cover"
                                            />
                                        )}
                                    </button>
                                    <span className="text-sm">{color}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div className="mb-6 border-b border-[#695C5C]/30 pb-4">
                    <h2 className="text-xl font-medium mb-2">Description</h2>
                    <p
                        style={{direction: "rtl"}}
                        className="text-xl font-normal text-left font-serif"
                        dangerouslySetInnerHTML={{__html: description}}
                    />
                </div>

                <div className="flex justify-between items-center mb-6">
                    <span className="text-xl font-serif font-medium">{currentPrice*quantity} IQD</span>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                        >
                            <Minus className="w-4 h-4 text-[#3B5345]"/>
                        </button>
                        <span className="text-lg font-medium">{quantity}</span>
                        <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                        >
                            <Plus className="w-4 h-4 text-[#3B5345]"/>
                        </button>
                    </div>
                </div>

                <button
                    className="w-full bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center">
                    <svg className="mr-2" width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9.50391 8.94834V7.81668C9.50391 5.19168 11.6156 2.61334 14.2406 2.36834C17.3672 2.06501 20.0039 4.52668 20.0039 7.59501V9.20501" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M11.2542 25.6666H18.2542C22.9442 25.6666 23.7842 23.7883 24.0292 21.5016L24.9042 14.5016C25.2192 11.6549 24.4025 9.33325 19.4209 9.33325H10.0875C5.10586 9.33325 4.28919 11.6549 4.60419 14.5016L5.47919 21.5016C5.72419 23.7883 6.56419 25.6666 11.2542 25.6666Z" stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M18.8318 14.0001H18.8423" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M10.6638 14.0001H10.6743" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Add To Cart
                </button>
            </div>
        </div>
    );
}