'use client'

import { useSearchParams } from 'next/navigation';
import React from 'react';

function SearchParamsHandler({ onParamsChange, params, setParams }) {
    const searchParams = useSearchParams();
    React.useEffect(() => {
        const c = searchParams.get('c') || '';
        const sc = searchParams.get('sc') || '';
        onParamsChange(c, sc);
        setParams(true)
        console.log(params)
    }, [searchParams, onParamsChange, setParams]);

    return null;
}

export default SearchParamsHandler;