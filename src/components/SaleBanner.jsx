'use client'
import React, { memo } from 'react';
import Marquee from 'react-fast-marquee';

const StarIcon = memo(() => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 0L18.3388 10.3538L27.3137 4.68629L21.6462 13.6612L32 16L21.6462 18.3388L27.3137 27.3137L18.3388 21.6462L16 32L13.6612 21.6462L4.68629 27.3137L10.3538 18.3388L0 16L10.3538 13.6612L4.68629 4.68629L13.6612 10.3538L16 0Z" fill="#FFA100"/>
    </svg>
));

StarIcon.displayName = 'StarIcon';

const BannerContent = memo(() => (
    <span className="inline-flex ml-4 items-center whitespace-nowrap">
    <span className="text-3xl font-sans px-4 -mr-2 py-1">Sale on entire stock</span>
      <StarIcon />
  </span>
));

BannerContent.displayName = 'BannerContent';

const SaleBanner = ({ speed = 50 }) => {
    return (
        <div className="overflow-hidden">
            <Marquee
                speed={speed}
                gradient={false}
                pauseOnHover={false}
                autoFill={true}
            >
                <BannerContent />
            </Marquee>
        </div>
    );
};

export default memo(SaleBanner);