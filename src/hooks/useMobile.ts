import { useState, useEffect } from 'react';

const useMobile = () => {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Media query to check if width is less than 768px (common mobile breakpoint)
        const mediaQuery = window.matchMedia('(max-width: 768px)');

        // Set initial value
        setIsMobile(mediaQuery.matches);

        // Event listener for changes
        const handleResize = (e: MediaQueryListEvent) => {
            setIsMobile(e.matches);
        };

        mediaQuery.addEventListener('change', handleResize);

        return () => {
            mediaQuery.removeEventListener('change', handleResize);
        };
    }, []);

    return isMobile;
};

export default useMobile;
