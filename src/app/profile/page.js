import React from 'react';
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";
import {Profile} from "@/components/Profile";
import AsyncNavBar from "@/components/AsyncNavBar";

export default function ProfilePage() {
    return (
        <>
            <AsyncNavBar />
            <div className="h-screen flex flex-col justify-between">
                <Profile />
            <Footer />
            </div>
        </>
    );
}