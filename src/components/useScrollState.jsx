import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const AnimatedImage = ({ src, alt, width, height, className }) => {
    const imgRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            if (imgRef.current) {
                const rect = imgRef.current.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

                const newScale = 1 + scrollProgress * 0.5; // Adjust the factor as needed
                setScale(newScale);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Initial call to set the scale

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            style={{
                width: '60%',
                overflow: 'hidden',
                position: 'relative'
            }}
        >
            <div style={{
                width: '100%',
                height: '100%',
                transform: `scale(${scale})`,
                transition: 'transform 0.1s ease-out',
                transformOrigin: 'center center',
            }}>
                <Image
                    src={src}
                    alt={alt}
                    fill={true}
                    className="-mt-2 mb-12 object-cover"
                />
            </div>
        </div>
    );
};

export default AnimatedImage;
