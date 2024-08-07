import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const AnimatedImage = ({ src, alt, width, height, className }) => {
    const imgRef = useRef(null);
    const [objectPosition, setObjectPosition] = useState('50% 50%');

    useEffect(() => {
        const handleScroll = () => {
            if (imgRef.current) {
                const rect = imgRef.current.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

                // حساب الـ object position الجديد
                // سيتحرك من 50% (المركز) إلى 45% (قريب من المركز) عند التمرير لأسفل
                const newPositionPercent = 50 - (scrollProgress * 5);
                setObjectPosition(`${newPositionPercent}% ${newPositionPercent}%`);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // استدعاء أولي لضبط الموضع

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div ref={imgRef} className="h-[400px] relative w-full" style={{ overflow: 'hidden' }}>
            <Image
                src={src}
                alt={alt}
                fill={true}
                className={className}
                style={{
                    objectFit: 'cover',
                    objectPosition: objectPosition,
                    transition: 'object-position 0.3s ease-out',
                }}
            />
        </div>
    );
};

export default AnimatedImage;