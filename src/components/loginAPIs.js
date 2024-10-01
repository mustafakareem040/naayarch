'use client'
export async function logout() {
    if (typeof window === 'undefined') return null;
    localStorage.removeItem("userData")
    localStorage.removeItem("token")
    localStorage.removeItem("userId")
    localStorage.removeItem("addresses")
}


