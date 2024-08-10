export default async function login(email, password, rememberMe) {
    try {
        const response = await fetch(
            "https://nay-backend.vercel.app/api/user/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://store2-umber.vercel.app',
                    'Access-Control-Allow-Origin': 'https://store2-umber.vercel.app',
                    'Access-Control-Allow-Credentials': true
                },
                body: JSON.stringify({email, password, rememberMe}),
                credentials: 'include'
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return await response.json();
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}