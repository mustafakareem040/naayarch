'use client'
import React, {useEffect, useRef, useState} from 'react';

const SaleBanner = ({ speed = 1 }) => {
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [contentWidth, setContentWidth] = useState(0);

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current && contentRef.current) {
                const containerWidth = containerRef.current.offsetWidth;
                const contentWidth = contentRef.current.offsetWidth;
                setContentWidth(contentWidth);

                const repetitions = Math.ceil(containerWidth / contentWidth) + 1;
                containerRef.current.style.setProperty('--repetitions', repetitions);
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const bannerStyle = {
        '--animation-duration': `${contentWidth > 0 ? contentWidth / (50 * speed) : 20}s`,
        '--content-width': `${contentWidth}px`,
    };

    const bannerContent = (
        <span className="inline-flex items-center whitespace-nowrap">
        <span className="text-3xl font-sans px-4 py-2">Sale on entire stock</span>
        <span className="text-yellow-400 text-5xl px-2">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 0L18.3388 10.3538L27.3137 4.68629L21.6462 13.6612L32 16L21.6462 18.3388L27.3137 27.3137L18.3388 21.6462L16 32L13.6612 21.6462L4.68629 27.3137L10.3538 18.3388L0 16L10.3538 13.6612L4.68629 4.68629L13.6612 10.3538L16 0Z" fill="#FFA100"/>
          </svg>
        </span>
      </span>
    );

    return (
        <div
            ref={containerRef}
            className="overflow-hidden m-4"
            style={bannerStyle}
        >
            <div className="animate-scroll inline-flex">
                {[...Array(3)].map((_, index) => (
                    <div key={index} ref={index === 0 ? contentRef : null} className="flex-shrink-0">
                        {bannerContent}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SaleBanner;