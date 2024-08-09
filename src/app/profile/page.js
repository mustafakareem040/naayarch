import React from 'react';
import LoginPage from "@/account/LoginPage";
import {NotificationProvider} from "@/components/NotificationContext";
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Profile() {
    return (
        <>
            <NavBar />
            <Profile />
            <Footer />
        </>
    );
}