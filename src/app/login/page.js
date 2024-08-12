import React from 'react';
import LoginPage from "@/account/LoginPage";
import {NotificationProvider} from "@/components/NotificationContext";
import Footer from "@/components/Footer";
import AsyncNavBar from "@/components/AsyncNavBar";

export default function Login() {
    return (
    <NotificationProvider>
        <AsyncNavBar />
        <LoginPage />
        <Footer />
    </NotificationProvider>
        );
}