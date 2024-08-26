import React, { useMemo } from 'react';
import ProductItem from "@/components/ProductItem";
import { FixedSizeGrid as Grid } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';

const ProductsList = ({ products }) => {
    const getCheapestPrice = (product) => {
        let prices = [];

        if (product.price) prices.push(product.price);
        if (product.sizes) prices = prices.concat(product.sizes.map(size => size.price).filter(Boolean));
        if (product.colors) {
            prices = prices.concat(product.colors.map(color => color.price).filter(Boolean));
            product.colors.forEach(color => {
                if (color.sizes) {
                    prices = prices.concat(color.sizes.map(size => size.price).filter(Boolean));
                }
            });
        }

        const validPrices = prices
            .map(price => {
                const cleaned = price.toString().replace(/[^\d.]/g, '');
                return parseFloat(cleaned);
            })
            .filter(price => !isNaN(price) && isFinite(price));

        return validPrices.length > 0 ? Math.min(...validPrices) : null;
    };

    const formatPrice = (price) => {
        if (price === null || price === undefined) return 'N/A';
        return `${price >= 10000 ? price.toLocaleString() : price} IQD`;
    };

    const memoizedProducts = useMemo(() => products.map((product) => {
        const cheapestPrice = getCheapestPrice(product);
        return {
            id: product.id,
            name: product.name,
            price: formatPrice(cheapestPrice),
            imageUrl: `https://storage.naayiq.com/resources/${product.images[0]?.url}` || "/placeholder.png"
        };
    }), [products]);

    const getGridParams = (width) => {
        const GAP = 16; // Gap size in pixels
        let columns;
        if (width < 640) columns = 2; // For small screens
        else if (width < 768) columns = 3; // For medium screens
        else if (width < 1024) columns = 4; // For large screens
        else columns = 5; // For extra large screens

        const columnWidth = Math.floor((width - (columns - 1) * GAP) / columns);
        const rowHeight = Math.floor(columnWidth * (275 / 186)) + GAP; // Maintain aspect ratio + gap

        return { columns, columnWidth, rowHeight, GAP };
    };

    const Cell = ({ columnIndex, rowIndex, style, data }) => {
        const { items, columns, columnWidth, rowHeight, GAP } = data;
        const index = rowIndex * columns + columnIndex;
        if (index >= items.length) return null;
        const product = items[index];

        const cellStyle = {
            ...style,
            left: style.left + (columnIndex * GAP),
            top: style.top + (rowIndex * GAP),
            width: columnWidth,
            height: rowHeight - GAP,
        };

        return (
            <div style={cellStyle}>
                <ProductItem
                    key={product.id}
                    title={product.name}
                    price={product.price}
                    imageUrl={product.imageUrl}
                />
            </div>
        );
    };

    return (
        <div style={{ height: '100vh', width: '100%' }}>
            <AutoSizer disableWidth={null}>
                {({ height, width }) => {
                    const { columns, columnWidth, rowHeight, GAP } = getGridParams(width);
                    return (
                        <Grid
                            columnCount={columns}
                            columnWidth={columnWidth}
                            height={height}
                            rowCount={Math.ceil(memoizedProducts.length / columns)}
                            rowHeight={rowHeight}
                            width={width}
                            itemData={{
                                items: memoizedProducts,
                                columns,
                                columnWidth,
                                rowHeight,
                                GAP
                            }}
                        >
                            {Cell}
                        </Grid>
                    );
                }}
            </AutoSizer>
        </div>
    );
};

export default ProductsList;