export default async function login(email, password, rememberMe) {
    try {
        const response = await fetch(
            "https://nay-backend.vercel.app/api/user/login",
            {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
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
        throw error;
    }
}