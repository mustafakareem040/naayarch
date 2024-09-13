import React from 'react';

const ShoppingBag = ({ width = 32, height = 32 }) => {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width={width}
            height={height}
            viewBox="0 0 32 32"
            fill="none"
        >
            <rect width={width} height={height} fill="#3B5345" rx={width / 2} />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit="10"
                strokeWidth="1.5"
                d="M12.6 12.7V12c0-1.8 1.4-3.4 3-3.6 2.1-.2 3.8 1.4 3.8 3.4v1M13.7 23.6h4.6c3 0 3.6-1.2 3.8-2.7l.5-4.6c.2-1.8-.3-3.3-3.6-3.3h-6c-3.3 0-3.8 1.5-3.6 3.3l.5 4.6c.2 1.5.8 2.7 3.8 2.7Z"
            />
            <path
                stroke="#fff"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M18.7 16h0M13.3 16h0"
            />
        </svg>
    );
};

export default ShoppingBag;