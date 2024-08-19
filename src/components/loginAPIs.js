import Cookies from "js-cookie";

export async function login(email, password, rememberMe) {
    return await fetch(
        "https://api.naayiq.com/user/login",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({email, password, rememberMe})
        }
    );
}
export async function signUp(name, email, password, phone) {
    return await fetch(
        "https://api.naayiq.com/user/signup",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({name, email, password, phone})
        }
    );
}

export async function logout() {
    const x = await fetch(
        "https://api.naayiq.com/user/logout",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
    Cookies.remove("token");
    return x;
}


export default function setCookies(data, rememberMe=false, signup=false)
{
    Cookies.set("token", data.token, {
        secure: true,
        sameSite: 'strict',
        expires:signup ? 7 : rememberMe ? 30 : undefined
    });
}