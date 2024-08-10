import Cookies from "js-cookie";

export async function login(email, password, rememberMe) {
    return await fetch(
        "https://nay-backend.vercel.app/api/user/login",
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Origin': 'https://store2-umber.vercel.app',
                'Accept': 'application/json'
            },
            credentials: "same-origin",
            body: JSON.stringify({email, password, rememberMe})
        }
    );
}
export default function setCookies(data, rememberMe)
{
    Cookies.set("token", data.token, {
        secure: true,
        sameSite: 'strict',
        expires: rememberMe ? 30 : undefined
    });
}