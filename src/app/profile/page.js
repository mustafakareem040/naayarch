import React from 'react';
import LoginPage from "@/account/LoginPage";
import {NotificationProvider} from "@/components/NotificationContext";
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";
import {Profile} from "@/components/Profile";

export default function ProfilePage() {
    return (
        <>
            <NavBar />
            <Profile />
            <Footer />
        </>
    );
}