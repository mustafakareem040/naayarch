'use client'

import { useSearchParams } from 'next/navigation';
import React from 'react';

function SearchParamsHandler({ onParamsChange }) {
    const searchParams = useSearchParams();

    React.useEffect(() => {
        const c = searchParams.get('c') || '';
        const sc = searchParams.get('sc') || '';
        onParamsChange(c, sc);
    }, [searchParams, onParamsChange]);

    return null;
}

export default SearchParamsHandler;