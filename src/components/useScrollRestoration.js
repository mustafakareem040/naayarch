// hooks/useScrollRestoration.js
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

export function useScrollRestoration() {
    const pathname = usePathname();

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        // Save scroll position before leaving the page
        const handleBeforeUnload = () => {
            localStorage.setItem(`scrollPosition_${pathname}`, window.scrollY.toString());
        };

        // Restore scroll position when returning to the page
        const savedScrollPosition = localStorage.getItem(`scrollPosition_${pathname}`);
        if (savedScrollPosition) {
            window.scrollTo(0, parseInt(savedScrollPosition, 10));
            localStorage.removeItem(`scrollPosition_${pathname}`);
        }

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [pathname]);
}