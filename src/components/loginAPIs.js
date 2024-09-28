import Cookies from "js-cookie";

export async function login(email, password, rememberMe) {
    return await fetch(
        `${process.env.NEXT_PUBLIC_API}/user/login`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({email, password, rememberMe})
        }
    );
}

export async function logout() {
    const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/user/logout`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
    if (response.ok) {
        Cookies.remove('accessToken');
    }
    return response;
}

export async function checkAuth() {
    return await fetch(
        "https://api.naayiq.com/user/check-auth",
        {
            method: 'GET',
            cache: "force-cache"
        }
    );
}
export async function signUp(name, email, password, phone) {
    return await fetch(
        `${process.env.NEXT_PUBLIC_API}/user/signup`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({name, email, password, phone})
        }
    );
}




export default function setCookies(data, rememberMe=false, signup=false)
{
    Cookies.set("token", data.token, {
        secure: true,
        sameSite: 'strict',
        expires:signup ? 7 : rememberMe ? 30 : undefined
    });
}