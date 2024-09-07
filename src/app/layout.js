// app/layout.js
import "./globals.css";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next"
import NextTopLoader from 'nextjs-toploader';
import {ReduxProvider} from "@/components/ReduxProvider";
export const runtime = 'edge'
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
    title: "Nay Store",
    description: "An Iraqi store for makeups",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <title>Nay Store</title>
        </head>
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
        <SpeedInsights />
        <ReduxProvider>
            {children}
        </ReduxProvider>

        </body>
        </html>
    );
}