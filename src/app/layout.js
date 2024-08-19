// app/layout.js
import "./globals.css";
import localFont from "next/font/local";
import { Figtree } from "next/font/google";
import NextTopLoader from 'nextjs-toploader';
export const figtree = Figtree({ subsets: ["latin"], variable: "--fig", display: "auto" });
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
    display: "auto"
});

async function getSubcategories() {
    const res = await fetch('https://nay-backend.vercel.app/api/subcategories', { cache: 'no-store' });
    if (!res.ok) {
        throw new Error('Failed to fetch subcategories');
    }
    return res.json();
}


export const metadata = {
    title: "Nay Store",
    description: "An Iraqi store for makeups",
};

export default function RootLayout({ children }) {
    return (
        <html lang="en">
        <head>
            <link
                rel="stylesheet"
                type="text/css"
                charSet="UTF-8"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick.min.css"
            />
            <link
                rel="stylesheet"
                type="text/css"
                href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.9.0/slick-theme.min.css"
            />
            <title>Nay Store</title>
        </head>
        <body className={`m-4 box-border overflow-x-hidden ${nnFont.variable} ${figtree.variable}`}>
        <NextTopLoader
            color="#3B5345"
            initialPosition={0.08}
            crawlSpeed={200}
            height={3}
            crawl={true}
            showSpinner={false}
            speed={300}
            shadow="0 0 10px #2299DD,0 0 5px #2299DD"
            />
            {children}
        </body>
        </html>
    );
}