'use client'
import React, { createContext, useContext, useState, useCallback } from 'react';

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
    const [products, setProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [scrollPosition, setScrollPosition] = useState(0);

    const updateProducts = useCallback((newProducts) => {
        setProducts((prevProducts) => [...prevProducts, ...newProducts]);
    }, []);

    const resetProducts = useCallback(() => {
        setProducts([]);
        setPage(1);
        setHasMore(true);
    }, []);

    const value = {
        products,
        updateProducts,
        resetProducts,
        page,
        setPage,
        hasMore,
        setHasMore,
        scrollPosition,
        setScrollPosition,
    };

    return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
};

export const useProducts = () => {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error('useProducts must be used within a ProductsProvider');
    }
    return context;
};