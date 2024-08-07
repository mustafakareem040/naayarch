import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

const ScalingImage = ({ src, alt, width, height, className, fill }) => {
    const imgRef = useRef(null);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        const handleScroll = () => {
            if (imgRef.current) {
                const rect = imgRef.current.getBoundingClientRect();
                const scrollProgress = (window.innerHeight - rect.top) / (window.innerHeight + rect.height);

                // حساب المقياس بناءً على التقدم في التمرير
                // يبدأ من 1 (حجم كامل) وينخفض إلى 0.9 عند التمرير للأسفل
                const newScale = 1 - (0.1 * Math.max(0, Math.min(1, scrollProgress)));

                setScale(newScale);
            }
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // استدعاء أولي لضبط المقياس

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div
            ref={imgRef}
            className="h-[400px] w-full"
            style={{
                transform: `scale(${scale})`,
                transition: 'transform 800ms cubic-bezier(0.25, 0.1, 0.25, 1)',
                transformOrigin: 'center center',
            }}
        >
            <Image
                src={src}
                alt={alt}
                fill={fill}
                className={className}
            />
        </div>
    );
};

export default ScalingImage;