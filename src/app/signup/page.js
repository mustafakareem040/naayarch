import React from 'react';
import SignUpPage from "@/account/SignUpPage";
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";
import {NotificationProvider} from "@/components/NotificationContext";

export default function SignUp() {
    return (
        <NotificationProvider>
        <NavBar />
        <SignUpPage />
        <Footer />
        </NotificationProvider>
    );
}