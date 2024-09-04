import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import AsyncNavBar from "@/components/AsyncNavBar";
import Footer from "@/components/Footer";
import { Profile } from "@/components/Profile";
import Image from "next/image";

async function getUserData() {
    const response = await fetch('https://api.naayiq.com/user/check-auth', {
        credentials: "include"
    });

    if (!response.ok) {
        throw new Error('Failed to fetch user data');
    }

    return response.json();
}

export default async function ProfilePage() {
    let userData;

    try {
        userData = await getUserData();
    } catch (error) {
        console.error('Error fetching user data:', error);
        redirect('/login');
    }

    if (!userData.isAuthenticated) {
        redirect('/login');
    }

    return (
        <>
            <AsyncNavBar bg={"#F6F3F1"} />
            <div className="relative left-0 -translate-y-[10%] -m-4 right-0 min-h-[100vw] top-0 w-[100vw]">
                <div className="font-sans absolute top-1/2 z-10 left-0 right-0 text-center text-3xl">
                    <p>Hi {userData.name}!</p>
                    <p className="text-base font-serif">Let your beauty shine!</p>
                </div>
                <Image src={"/bg_flowers.png"} alt={"bg_flowers"} fill={true}
                       className="object-contain"/>
            </div>
            <div className="h-screen flex flex-col justify-between">
                <Profile />
                <Footer />
            </div>
        </>
    );
}