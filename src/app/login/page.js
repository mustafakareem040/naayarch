'use client'

import React from 'react';
import LoginPage from "@/account/LoginPage";
import {NotificationProvider} from "@/components/NotificationContext";
import {NavBar} from "@/components/NavBar";
import Footer from "@/components/Footer";

export default function Login() {
    return (
    <NotificationProvider>
        <NavBar />
        <LoginPage />
        <Footer />
    </NotificationProvider>
        );
}