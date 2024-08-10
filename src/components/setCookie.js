import Cookies from "js-cookie";

export async function login(email, password, rememberMe) {
    try {
        const response = await fetch(
            "https://nay-backend.vercel.app/api/user/login",
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Origin': 'https://store2-umber.vercel.app',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({email, password, rememberMe})
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Login failed');
        }

        return await response;
    } catch (error) {
        console.error('Login error:', error);
        if (error.message === 'Failed to fetch') {
            throw new Error('Network error. Please check your connection and try again.');
        }
        throw error;
    }
}

export default function setCookies(data, rememberMe)
{
    Cookies.set("token", data.token, {
        secure: true,
        sameSite: 'strict',
        expires: rememberMe ? 30 : undefined
    });
}