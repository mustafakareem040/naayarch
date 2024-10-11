'use client';

import React, {
    useState,
    useEffect,
    useCallback,
    useMemo,
    Suspense
} from 'react';
import { ArrowLeft, Minus, Plus } from 'lucide-react';
import 'slick-carousel/slick/slick.css';
import '@/components/NotificationStyles.css';
import 'slick-carousel/slick/slick-theme.css';

const Slider = React.lazy(() => import('react-slick'));
const Lightbox = React.lazy(() => import("yet-another-react-lightbox"));
import Zoom from "yet-another-react-lightbox/plugins/zoom";
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen";
import "yet-another-react-lightbox/styles.css";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/NotificationContext";
import Link from "next/link";
import WishlistHeart from "@/components/WishlistHeart";

const formatPrice = (price) => {
    const formattedPrice = price >= 10000 ? price.toLocaleString() : price.toString();
    return `${formattedPrice} IQD`;
};

export default function ProductDetail({ product, isInWishlist }) {
    const [selectedColor, setSelectedColor] = useState(null);
    const [selectedSize, setSelectedSize] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [maxQuantity, setMaxQuantity] = useState(1); // New state for max quantity
    const [currentPrice, setCurrentPrice] = useState(product.price);
    const [lightboxOpen, setLightboxOpen] = useState(false);
    const [lightboxIndex, setLightboxIndex] = useState(0);
    const { addNotification } = useNotification();
    const [cartItems, setCartItems] = useState([]);
    const router = useRouter();

    // New state for internal wishlist status
    const [internalIsInWishlist, setInternalIsInWishlist] = useState(false);

    // **New State for Color Images**
    const [colorImages, setColorImages] = useState({});

    // **Memoize unique images to prevent duplicates**
    const images = useMemo(() => {
        const uniqueUrls = new Set(product.images.map(img => img.url || img));
        return Array.from(uniqueUrls);
    }, [product.images]);

    // Memoize lightbox slides
    const lightboxSlides = useMemo(() => {
        return images.map(src => ({
            src: `https://storage.naayiq.com/resources/${src}`
        }));
    }, [images]);

    // **Fetch color images using the API**
    useEffect(() => {
        const fetchColorImages = async () => {
            const updatedColorImages = {};
            await Promise.all(product.colors.map(async (color) => {
                try {
                    const response = await fetch(`https://dev.naayiq.com/colors/${encodeURIComponent(color.name)}`);
                    const data = await response.json();
                    if (data.url) {
                        updatedColorImages[color.id] = `https://storage.naayiq.com/resources/${data.url}`;
                    } else {
                        updatedColorImages[color.id] = null; // Image not found
                    }
                } catch (error) {
                    console.error(`Error fetching image for color ${color.name}:`, error);
                    updatedColorImages[color.id] = null; // On error, treat as not found
                }
            }));
            setColorImages(updatedColorImages);
        };

        fetchColorImages();
    }, [product.colors]);

    // Determine the maximum available quantity based on selected attributes
    const determineMaxQuantity = useCallback(() => {
        if (selectedSize) {
            return selectedSize.qty;
        } else if (selectedColor) {
            return selectedColor.qty;
        } else {
            return product.qty;
        }
    }, [selectedSize, selectedColor, product.qty]);

    useEffect(() => {
        window.scrollTo(0, 0);
        const initializeSelections = () => {
            const cart = JSON.parse(localStorage.getItem('cart')) || [];
            setCartItems(cart);
            if (product.has_color && product.colors.length > 0) {
                const defaultColor = product.colors.find(color => color.qty > 0 || (color.has_size && color.sizes.some(size => size.qty > 0))) || product.colors[0];
                setSelectedColor(defaultColor);

                if (defaultColor.has_size && defaultColor.sizes.length > 0) {
                    const defaultSize = defaultColor.sizes.find(size => size.qty > 0) || defaultColor.sizes[0];
                    setSelectedSize(defaultSize);
                } else {
                    setSelectedSize(null);
                }
            } else if (product.has_size && product.sizes.length > 0) {
                const defaultSize = product.sizes.find(size => size.qty > 0) || product.sizes[0];
                setSelectedSize(defaultSize);
            } else {
                setSelectedSize(null);
            }
            updatePrice();
        };

        initializeSelections();
    }, [product]);

    const updatePrice = useCallback(() => {
        let price = product.price;

        if (selectedSize && selectedSize.price) {
            price = selectedSize.price;
        } else if (selectedColor && selectedColor.price) {
            price = selectedColor.price;
        }

        setCurrentPrice(parseFloat(price));
    }, [product, selectedColor, selectedSize]);

    useEffect(() => {
        setMaxQuantity(determineMaxQuantity());
        if (quantity > determineMaxQuantity()) {
            setQuantity(determineMaxQuantity() || 1);
        }
    }, [determineMaxQuantity, quantity]);

    useEffect(() => {
        updatePrice();
    }, [selectedColor, selectedSize, updatePrice]);

    const handleColorChange = (color) => {
        setSelectedColor(color);
        if (color.has_size && color.sizes.length > 0) {
            const availableSize = color.sizes.find(size => size.qty > 0) || color.sizes[0];
            setSelectedSize(availableSize);
        } else {
            setSelectedSize(null);
        }
    };

    const handleSizeChange = (e) => {
        const sizeId = parseInt(e.target.value);
        const availableSizes = selectedColor && selectedColor.has_size ? selectedColor.sizes : product.sizes;
        const newSize = availableSizes.find(size => size.id === sizeId);
        setSelectedSize(newSize);
    };

    const isInCart = useCallback(() => {
        return cartItems.some(item =>
            item.product_id === product.id &&
            item.color_id === selectedColor?.id &&
            item.size_id === selectedSize?.id
        );
    }, [cartItems, product.id, selectedColor, selectedSize]);

    const handleAddToCart = () => {
        const finalQuantity = Math.min(quantity, maxQuantity);
        const cartItem = {
            product_id: product.id,
            color_id: selectedColor?.id,
            size_id: selectedSize?.id,
            qty: finalQuantity
        };

        let updatedCart = [...cartItems];
        const existingItemIndex = updatedCart.findIndex(item =>
            item.product_id === cartItem.product_id &&
            item.color_id === cartItem.color_id &&
            item.size_id === cartItem.size_id
        );

        if (existingItemIndex > -1) {
            updatedCart[existingItemIndex].qty += finalQuantity;
            // Ensure it does not exceed maxQuantity
            updatedCart[existingItemIndex].qty = Math.min(updatedCart[existingItemIndex].qty, maxQuantity);
        } else {
            updatedCart.push(cartItem);
        }

        localStorage.setItem('cart', JSON.stringify(updatedCart));
        setCartItems(updatedCart);
        addNotification('success', 'Product Added To Cart');
    };

    const sliderSettings = useMemo(() => ({
        dots: images.length > 1,
        infinite: false,
        speed: 500,
        slidesToShow: 1,
        slidesToScroll: 1,
        customPaging: function (i) {
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
    }), [images.length]);

    const isOutOfStock = useMemo(() => {
        if (product.has_color && selectedColor) {
            if (selectedColor.has_size) {
                return !selectedColor.sizes.some(size => size.qty > 0);
            }
            return selectedColor.qty === 0;
        } else if (product.has_size && selectedSize) {
            return selectedSize.qty === 0;
        } else {
            return product.qty === 0;
        }
    }, [product, selectedColor, selectedSize]);

    const fetchWishlist = useCallback(async () => {
        const token = localStorage.getItem("token");
        if (!token) return;

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/wishlist`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.ok) {
                const w = await response.json();
                const wishlistIds = w.wishlist.map(item => item.id);
                setInternalIsInWishlist(wishlistIds.includes(product.id));
            }
        } catch (error) {
            console.error('Error fetching wishlist:', error);
        }
    }, [product.id]);

    // Fetch wishlist if isInWishlist prop is undefined
    useEffect(() => {
        if (isInWishlist === undefined) {
            fetchWishlist();
        }
    }, [isInWishlist, fetchWishlist]);

    // Determine the final isInWishlist value;

    return (
        <div className="flex overflow-x-hidden font-serif relative z-50 font-medium flex-col -mt-4 -mx-4 bg-white">
            <Suspense fallback={<div>Loading images...</div>}>
                <Slider {...sliderSettings} className="w-full mb-2 h-[55vh]">
                    {images.map((image, index) => (
                        <div key={index} className="relative w-full h-[60vh]" onClick={() => {
                            setLightboxIndex(index);
                            setLightboxOpen(true);
                        }}>
                            <Image
                                src={`https://storage.naayiq.com/resources/${image}`}
                                alt={`Product image ${index + 1}`}
                                fill={true}
                                unoptimized={true}
                                className="w-full object-cover cursor-pointer"
                                priority={index === 0}
                            />
                        </div>
                    ))}
                </Slider>
            </Suspense>

            <Suspense fallback={<div>Loading lightbox...</div>}>
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
                    }}
                />
            </Suspense>

            <button
                className="absolute h-12 rounded-[100%] w-12 bg-white-gradient flex justify-center items-center top-4 left-4 z-10"
                onClick={router.back}
            >
                <ArrowLeft width={30} height={30} strokeWidth={1} />
            </button>
           <button
                className="h-12 rounded-[100%] w-12 absolute top-4 right-4 z-50 bg-white-gradient flex justify-center items-center">
                <WishlistHeart
                    id={product.id}
                    isInWishlist2={isInWishlist !== undefined ? isInWishlist : internalIsInWishlist}
                />
            </button>


            <div
                className="flex-grow bg-white rounded-t-xl shadow-[0px_-4px_8px_3px_rgba(105,92,92,0.1)] p-6 mt-2 relative z-30">
                <div className="w-9 h-1 bg-black opacity-70 rounded-full mx-auto mb-6" />
                <h1 className="text-xl font-semibold mb-1 capitalize">{product.name}</h1>

                {isOutOfStock && (
                    <p className="text-red-500 mt-2 text-lg font-semibold">Out of Stock</p>
                )}

                {product.has_color && product.colors.length > 0 && (
                    <div className="mb-10 mt-6">
                        <h2 className="text-xl font-medium mb-2">Color</h2>
                        <div className="flex space-x-4 overflow-x-auto pb-2">
                            {product.colors.map((color) => (
                                <div key={color.id} className="flex flex-col items-center">
                                    <button
                                        className={`w-20 h-20 rounded-full border-[#695C5C]/50 border ${selectedColor?.id === color.id ? 'shadow-none' : 'shadow-[0px_4px_4px_rgba(105,92,92,0.2)]'} mb-2 overflow-hidden`}
                                        onClick={() => handleColorChange(color)}
                                        disabled={color.qty === 0 && !color.has_size}
                                        aria-label={`Select color ${color.name}`}
                                    >
                                        {/* **Render fetched color image or fallback to white circle** */}
                                        {colorImages[color.id] ? (
                                            <Image
                                                src={colorImages[color.id]}
                                                alt={color.name}
                                                width={60}
                                                height={60}
                                                unoptimized={true}
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-white flex items-center justify-center">
                                                <span className="text-sm text-gray-500 capitalize">{color.name.charAt(0)}</span>
                                            </div>
                                        )}
                                    </button>
                                    <span className="text-sm capitalize">{color.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {((product.has_size && product.sizes.length > 0) || (selectedColor && selectedColor.has_size && selectedColor.sizes.length > 0)) && (
                    <div className="mb-6 font-serif">
                        <select
                            value={selectedSize ? selectedSize.id : ''}
                            onChange={handleSizeChange}
                            className="w-32 p-2 border border-[#E5E7EB] rounded-lg font-serif bg-white"
                            aria-label="Select size"
                        >
                            <option value="" disabled>Select Size</option>
                            {(selectedColor && selectedColor.has_size ? selectedColor.sizes : product.sizes).map((size) => (
                                <option key={size.id} value={size.id} disabled={size.qty === 0}>
                                    Size: {size.name} {size.qty === 0 && '(Out of Stock)'}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                <div className="mb-6 pb-28">
                    <h2 className="text-xl font-semibold w-fit mb-2">Description</h2>
                    <div
                        style={{ direction: "rtl" }}
                        className="text-xl mr-2 font-normal text-right font-serif"
                        dangerouslySetInnerHTML={{
                            __html: product.description.split('\n').map((item, index) => {
                                if (index === 0) {
                                    return `<p class="text-xl font-semibold mb-2">${item}</p>`;
                                } else if (item.includes(':')) {
                                    return `<p class="text-lg font-semibold mt-4 mb-2">${item}</p>`;
                                } else if (item.trim().startsWith('-')) {
                                    return `<li>${item.trim().substring(1)}</li>`;
                                } else {
                                    return `<p>${item}</p>`;
                                }
                            }).join('').replace(/(<li>.?<\/li>)+/g, function (match) {
                                return `<ul class="list-disc pl-5 mb-2">${match}</ul>`;
                            })
                        }}
                    />
                </div>

                <footer
                    className="fixed mt-12 border-[#695C5C]/30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05),0_-2px_4px_-1px_rgba(0,0,0,0.06)] bottom-0 bg-white p-4 right-0 left-0 z-50">
                    <div className="flex justify-between items-center mb-6">
                        {!isOutOfStock &&
                            <>
                                <span
                                    className="text-xl font-serif font-medium">{formatPrice(currentPrice * quantity)}</span>
                                <div className="flex items-center space-x-4">
                                    <button
                                        onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                        className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                                        disabled={isOutOfStock || quantity <= 1}
                                        aria-label="Decrease quantity"
                                    >
                                        <Minus className="w-4 h-4 text-[#3B5345]" />
                                    </button>
                                    <span className="text-lg font-medium">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(prev => Math.min(prev + 1, maxQuantity))}
                                        className="w-8 h-8 flex items-center justify-center border border-[#E5E7EB] rounded-full"
                                        disabled={isOutOfStock || quantity >= maxQuantity}
                                        aria-label="Increase quantity"
                                    >
                                        <Plus className="w-4 h-4 text-[#3B5345]" />
                                    </button>
                                </div>
                            </>}
                    </div>

                    {/* Conditionally render the Add to Cart or Buy Now button based on stock status */}
                    {!isOutOfStock && (
                        isInCart() ? (
                            <Link
                                href="/cart"
                                className="w-full font-serif bg-[rgba(59,83,69,0.05)] text-[#3B5345] py-3 rounded-lg font-medium text-lg flex items-center justify-center transition duration-300 border border-[#3B5345]"
                            >
                                <svg className="mr-2" width="29" height="28" viewBox="0 0 29 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.50391 8.94834V7.81668C9.50391 5.19168 11.6156 2.61334 14.2406 2.36834C17.3672 2.06501 20.0039 4.52668 20.0039 7.59501V9.20501"
                                        stroke="#3B5345" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path
                                        d="M11.2542 25.6666H18.2542C22.9442 25.6666 23.7842 23.7883 24.0292 21.5016L24.9042 14.5016C25.2192 11.6549 24.4025 9.33325 19.4209 9.33325H10.0875C5.10586 9.33325 4.28919 11.6549 4.60419 14.5016L5.47919 21.5016C5.72419 23.7883 6.56419 25.6666 11.2542 25.6666Z"
                                        stroke="#3B5345" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M18.8318 14.0001H18.8423" stroke="#3B5345" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.6638 14.0001H10.6743" stroke="#3B5345" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Buy Now
                            </Link>
                        ) : (
                            <button
                                onClick={handleAddToCart}
                                className="w-full font-serif bg-[#3B5345] text-white py-3 rounded-lg font-medium text-lg flex items-center justify-center transition duration-300"
                            >
                                <svg className="mr-2" width="29" height="28" viewBox="0 0 29 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M9.50391 8.94834V7.81668C9.50391 5.19168 11.6156 2.61334 14.2406 2.36834C17.3672 2.06501 20.0039 4.52668 20.0039 7.59501V9.20501"
                                        stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path
                                        d="M11.2542 25.6666H18.2542C22.9442 25.6666 23.7842 23.7883 24.0292 21.5016L24.9042 14.5016C25.2192 11.6549 24.4025 9.33325 19.4209 9.33325H10.0875C5.10586 9.33325 4.28919 11.6549 4.60419 14.5016L5.47919 21.5016C5.72419 23.7883 6.56419 25.6666 11.2542 25.6666Z"
                                        stroke="white" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round"
                                        strokeLinejoin="round" />
                                    <path d="M18.8318 14.0001H18.8423" stroke="white" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10.6638 14.0001H10.6743" stroke="white" strokeWidth="2"
                                          strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                Add To Cart
                            </button>
                        )
                    )}
                </footer>
            </div>
        </div>
    );
}