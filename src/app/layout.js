// app/layout.js
import "./globals.css";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import React from "react";
import IsAuth from "@/components/isAuth";

export const figtree = Figtree({ subsets: ["latin"], variable: "--fig", display: "swap" });
const nnFont = localFont({
    src: [
        {
            path: "./fonts/nn-regular.woff2",
            weight: "400",
            style: "normal",
        },
        {
            path: "./fonts/nn-medium.woff2",
            weight: "500",
            style: "normal",
        },
    ],
    variable: "--nn-font",
    display: "swap"
});

export const metadata = {
    title: {
        default: "Naay - Your Iraqi Store for Korean and Global Beauty Products",
        template: "%s | Naay"
    },
    description: "Discover premium Korean and global beauty products at Naay, Iraq's leading online store for skincare, makeup, and body care.",
    keywords: ["Iraqi beauty store", "Korean skincare", "Iraqi skincare store", "Naay Iraq", "NaayIraq", "naayiq", "Naay", "Global beauty brands", "Makeup", "Skincare", "Body care"],
    openGraph: {
        title: "Naay - Premium Beauty Products in Iraq",
        description: "Shop the best Korean and global beauty products at Naay. Your one-stop shop for skincare, makeup, and more in Iraq.",
        url: "https://naayiq.com",
        siteName: "Naay",
        locale: "en_US",
        type: "website",
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
        },
    }
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <body className={`m-4 box-border overflow-x-hidden ${nnFont.variable} ${figtree.variable}`}>
        <NextTopLoader
            color="#3B5345"
            initialPosition={0.08}
            crawlSpeed={200}
            height={2}
            crawl={true}
            showSpinner={false}
            speed={300}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
        />
        <IsAuth />
        {children}
        </body>
        </html>
    );
}