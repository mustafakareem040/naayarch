'use client'
import React, {useState, useEffect, useRef, useCallback} from 'react';
import { Slider, ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
    palette: {
        primary: {
            main: '#97C86C',
        },
    },
});

const ProductFilterComponent = ({onFilter, modalRef, filter, setFilter}) => {
    const [priceRange, setPriceRange] = useState([10000, 150000]);
    const [inStock, setInStock] = useState(true);
    const [sortBy, setSortBy] = useState('');

    

    const handleFilterClose = useCallback(() => {
        setFilter(false);
        document.body.style.overflow = 'auto';
    }, [setFilter]);

    const handleOutsideClick = useCallback((e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
            handleFilterClose();
        }
    }, [handleFilterClose]);

    const handleApplyFilter = () => {
        onFilter({ priceRange, inStock, sortBy });
        handleFilterClose();
    };

    const handleResetFilter = () => {
        setPriceRange([10000, 150000]);
        setInStock(true);
        setSortBy('');
    };

    const handlePriceRangeChange = (event, newValue, activeThumb) => {
        if (!Array.isArray(newValue)) {
            return;
        }

        const minDistance = 1;

        if (activeThumb === 0) {
            const newMinValue = Math.min(newValue[0], priceRange[1] - minDistance);
            setPriceRange([newMinValue, priceRange[1]]);
        } else {
            const newMaxValue = Math.max(newValue[1], priceRange[0] + minDistance);
            setPriceRange([priceRange[0], newMaxValue]);
        }
    };

    const valuetext = (value) => {
        return `${value} IQD`;
    };

    useEffect(() => {
        if (filter) {
            document.addEventListener('mousedown', handleOutsideClick);
        } else {
            document.removeEventListener('mousedown', handleOutsideClick);
        }

        return () => {
            document.removeEventListener('mousedown', handleOutsideClick);
        };
    }, [handleOutsideClick, filter]);

    return (
        <>
                            <div className="flex justify-center mb-2">
                                <div className="w-10 h-1 bg-black rounded-full"></div>
                            </div>
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-medium font-sans">Filter Products</h2>
                                <button
                                    onClick={handleResetFilter}
                                    className="text-[#97C86C] font-sans text-sm font-medium"
                                >
                                    Reset Filter
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <h3 className="text-lg font-medium font-sans mb-4">Price Range</h3>
                                    <ThemeProvider theme={theme}>
                                        <div className="relative pt-6 mx-16 pb-8">
                                            <Slider
                                                getAriaLabel={() => 'Price range'}
                                                value={priceRange}
                                                onChange={handlePriceRangeChange}
                                                valueLabelDisplay="off"
                                                getAriaValueText={valuetext}
                                                min={10000}
                                                max={150000}
                                                disableSwap
                                                sx={{
                                                    '& .MuiSlider-thumb': {
                                                        height: 24,
                                                        width: 24,
                                                        backgroundColor: 'currentColor',
                                                        '&:focus, &:hover, &.Mui-active, &.Mui-focusVisible': {
                                                            boxShadow: 'inherit',
                                                        },
                                                    },
                                                    '& .MuiSlider-track': {
                                                        height: 4,
                                                    },
                                                    '& .MuiSlider-rail': {
                                                        height: 4,
                                                        opacity: 0.5,
                                                        backgroundColor: '#bfbfbf',
                                                    },
                                                }}
                                            />
                                            <div className="absolute bottom-0 left-0 right-0 flex justify-between">
                                                <span
                                                    className="font-serif text-sm"
                                                    style={{
                                                        position: 'absolute',
                                                        left: `${((priceRange[0] - 10000) / (150000 - 10000)) * 100}%`,
                                                        transform: 'translateX(-100%) translateY(-100%)',
                                                    }}
                                                >
                                                    {priceRange[0]} IQD
                                                </span>
                                                <span
                                                    className="font-serif text-sm"
                                                    style={{
                                                        position: 'absolute',
                                                        right: `${100 - ((priceRange[1] - 10000) / (150000 - 10000)) * 100}%`,
                                                        transform: 'translateX(100%) translateY(-100%)',
                                                    }}
                                                >
                                                    {priceRange[1]} IQD
                                                </span>
                                            </div>
                                        </div>
                                    </ThemeProvider>
                                </div>
                                <div>
                                    <h3 className="text-lg font-sans font-medium mb-4">Availability</h3>
                                    <div className="flex font-sans items-center space-x-4">
                                        <button
                                            onClick={() => setInStock(true)}
                                            className={`flex items-center text-black`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-[100%] border flex items-center justify-center mr-2 ${inStock ? 'border-[#3B5345]' : 'border-[#695C5C]/50'}`}>
                                                {inStock && (
                                                    <div className="w-5 h-5 bg-[#97C86C] rounded-full"></div>
                                                )}
                                            </div>
                                            In Stock
                                        </button>
                                        <button
                                            onClick={() => setInStock(false)}
                                            className={`flex items-center text-black`}
                                        >
                                            <div
                                                className={`w-8 h-8 rounded-[100%] border flex items-center justify-center mr-2 ${!inStock ? 'border-[#3B5345]' : 'border-[#695C5C]/50'}`}>
                                                {!inStock && (
                                                    <div className="w-5 h-5 bg-[#97C86C] rounded-full"></div>
                                                )}
                                            </div>
                                            Out Stock
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-sans font-medium  mb-4">Sort by</h3>
                                    <div className="grid font-serif font-medium text-xs ssm:text-base grid-cols-2 gap-9">
                                        {['Price: Low to High', 'Name: Z to A', 'Price: High to Low', 'Best Selling', 'Name: A to Z', 'Newest Arrivals'].map((option) => (
                                            <button
                                                key={option}
                                                onClick={() => setSortBy(option)}
                                                className={`py-6 px-1 rounded-md border ${
                                                    sortBy === option
                                                        ? 'bg-[#3B5345] text-white'
                                                        : 'bg-white text-black'
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <button
                                onClick={handleApplyFilter}
                                className="w-full bg-[#3B5345] font-sans text-white py-3 rounded-lg mt-6 text-lg font-medium"
                            >
                                Apply Filter
                            </button>
        </>
    );
};

export default ProductFilterComponent;