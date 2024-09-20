export const AUTH_KEY = 'authState';


export const getAuthState = () => {
    if (typeof window === 'undefined') return null;

    try {
        const storedState = localStorage.getItem(AUTH_KEY);
        if (storedState) {
            return JSON.parse(storedState);
        }
    } catch (error) {
        console.error('Error accessing localStorage:', error);
    }
    return null;
};

/**
 * Safely saves data to localStorage.
 * @param {Object} state - The authentication state to store.
 */
export const setAuthState = (state) => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.setItem(AUTH_KEY, JSON.stringify(state));
    } catch (error) {
        console.error('Error saving to localStorage:', error);
    }
};


export const clearAuthState = () => {
    if (typeof window === 'undefined') return;

    try {
        localStorage.removeItem(AUTH_KEY);
    } catch (error) {
        console.error('Error removing from localStorage:', error);
    }
};