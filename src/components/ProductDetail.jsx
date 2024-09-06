'use client'
import React, { useState, useEffect } from 'react';
import { ArrowLeft, Heart, Minus, Plus } from 'lucide-react';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import '@/components/NotificationStyles.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Lightbox from "yet-another-react-lightbox";
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import {useNotification} from "@/components/NotificationContext";

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
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const { addNotification } = useNotification();
    const [isAddedToCart, setIsAddedToCart] = useState(false);
    const router = useRouter()


    useEffect(() => {
        if (selectedSize) {
            const sizeIndex = sizeNames.indexOf(selectedSize);
            setCurrentPrice(sizePrices[sizeIndex]);
        }
    }, [selectedSize, sizeNames, sizePrices]);
    const handleAddToCart = async () => {
        try {
            const response = await fetch('https://naayiq.com/api', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title,
                    selectedSize,
                    selectedColor,
                    quantity,
                    price: currentPrice
                }),
            });

            if (response.ok) {
                setIsAddedToCart(true);
                addNotification('success', 'Product Added To Cart');
            } else {
                addNotification('error', 'Failed to add product to cart');
            }
        } catch (error) {
            console.error('Error adding to cart:', error);
            addNotification('error', 'Failed to add product to cart');
        }
    };
    const sliderSettings = {
        dots: images.length > 1,
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

    const lightboxSlides = images.map(src => ({ src }));

    return (
        <div className="flex overflow-x-hidden font-serif font-medium flex-col -mt-5 -mx-4 bg-white">
            <Slider {...sliderSettings} className="w-full mb-6 h-[55vh]">
                {images.map((image, index) => (
                    <div key={index} className="relative w-full h-[60vh]" onClick={() => { setLightboxIndex(index); setLightboxOpen(true); }}>
                        <Image
                            src={image || 'https://storage.naayiq.com/resources/noimage.png'}
                            alt={`Product image ${index + 1}`}
                            fill={true}
                            unoptimized={true}
                            className="w-full object-cover cursor-pointer"
                            priority={index === 0}
                        />
                    </div>
                ))}
            </Slider>

            <Lightbox
                open={lightboxOpen}
                close={() => setLightboxOpen(false)}
                index={lightboxIndex}
                slides={lightboxSlides}
                plugins={[Zoom, Fullscreen]}
                carousel={{
                    finite: images.length <= 1,
                    navigationDisabled: images.length <= 1
                }}
                animation={{ zoom: 500 }}
                zoom={{
                    maxZoomPixelRatio: 5,
                    zoomInMultiplier: 2,
                    doubleTapDelay: 300,
                    doubleClickDelay: 300,
                    doubleClickMaxStops: 2,
                    keyboardMoveDistance: 50,
                    wheelZoomDistanceFactor: 100,
                    pinchZoomDistanceFactor: 100,
                    scrollToZoom: true,
                }} />
            <button
                className="absolute h-12 rounded-[100%] w-12 bg-white-gradient flex justify-center items-center top-4 left-4 z-10"
                onClick={router.back}>
                <ArrowLeft width={30} height={30} strokeWidth={1}/>
            </button>
            <button
                className="h-12 rounded-[100%] w-12 absolute top-4 right-4 z-10 bg-white-gradient flex justify-center items-center">
            <Heart
                className="w-[1.85rem] h-[1.85rem] z-10 text-transparent stroke-1 stroke-[#C91C1C] hover:stroke-[#C91C1C] hover:text-[#C91C1C] fill-current"/>
            </button>

            <div
                className="flex-grow bg-white rounded-t-xl shadow-[0px_-4px_8px_3px_rgba(105,92,92,0.1)] p-6 mt-2 relative z-30">
                <div className="w-9 h-1 bg-black opacity-70 rounded-full mx-auto mb-6"/>
                <h1 className="text-xl font-semibold mb-1 capitalize">{title}</h1>

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

                <div className="mb-6 pb-28">
                    <h2 className="text-xl font-semibold mb-2">Description</h2>
                    <p
                        style={{direction: "rtl"}}
                        className="text-xl font-normal text-left font-serif"
                        dangerouslySetInnerHTML={{__html: description}}
                    />
                </div>
                <footer className="fixed mt-12 border-[#695C5C]/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bottom-0 bg-white p-4 right-0 left-0 z-50">
                    <div className="flex justify-between items-center mb-6">
                        <span className="text-xl font-serif font-medium">{currentPrice * quantity} IQD</span>
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
                        onClick={handleAddToCart}
                        className={`w-full font-serif ${isAddedToCart ? 'bg-[#4CAF50] hover:bg-[#45a049]' : 'bg-[#3B5345] hover:bg-[#2E4035]'} text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center transition duration-300`}
                    >
                        {isAddedToCart ? (
                            <>
                                <svg className="mr-2" width="24" height="24" viewBox="0 0 24 24" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20 7L9 18L4 13" stroke="white" strokeWidth="2" strokeLinecap="round"
                                          strokeLinejoin="round"/>
                                </svg>
                                Buy Now
                            </>
                        ) : (
                            <>
                                <svg className="mr-2" width="29" height="28" viewBox="0 0 29 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.50391 8.94834V7.81668C9.50391 5.19168 11.6156 2.61334 14.2406 2.36834C17.3672 2.06501 20.0039 4.52668 20.0039 7.59501V9.20501"
                                        stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                    <path
                                        d="M11.2542 25.6666H18.2542C22.9442 25.6666 23.7842 23.7883 24.0292 21.5016L24.9042 14.5016C25.2192 11.6549 24.4025 9.33325 19.4209 9.33325H10.0875C5.10586 9.33325 4.28919 11.6549 4.60419 14.5016L5.47919 21.5016C5.72419 23.7883 6.56419 25.6666 11.2542 25.6666Z"
                                        stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round"/>
                                    <path d="M18.8318 14.0001H18.8423" stroke="white" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                    <path d="M10.6638 14.0001H10.6743" stroke="white" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                Add To Cart
                            </>
                        )}
                    </button>
                </footer>
            </div>
        </div>
    );
}