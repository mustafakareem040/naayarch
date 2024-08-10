'use strict';

export default async function login(email, password, rememberMe) {
    return await fetch(
        "https://nay-backend.vercel.app/api/user/login",
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({email, password, rememberMe}),
            credentials: 'include' // This is important for sending and receiving cookies
        }
    )
}

