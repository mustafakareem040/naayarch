import React from 'react';
import SignUpPage from "@/account/SignUpPage";
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";
import {NotificationProvider} from "@/components/NotificationContext";
import AsyncNavBar from "@/components/AsyncNavBar";
export const metadata = {
    title: "Signup",
    description: "Sign up for more features!",
    openGraph: {
        title: "Signup",
        description: "Sign up for more features",
    },
};
export default function SignUp() {
    return (
        <NotificationProvider>
        <AsyncNavBar />
        <SignUpPage />
        <Footer />
        </NotificationProvider>
    );
}