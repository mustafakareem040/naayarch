// app/layout.js
import "./globals.css";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
import StoreProvider from "@/app/StoreProvider";
import Head from "next/head";
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
    title: "Naay Store",
    description: "An Iraqi store for makeups",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <Head>
            <title>Naay Store</title>
            <meta name="viewport" content="width=device-width, initial-scale=1"/>
        </Head>
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
        <StoreProvider>
            {children}
        </StoreProvider>
        </body>
        </html>
    );
}