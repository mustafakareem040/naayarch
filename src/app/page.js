// app/page.js
import Dashboard from "../components/Dashboard";

export const metadata = {
    title: "Naay - Your Iraqi Store for Korean and Global Beauty Products",
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

export default function Home() {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        "name": "Naay",
        "alternateName": "NaayIraq",
        "url": "https://naayiq.com",
        "description": "Naay is Iraq's leading online store for Korean and global beauty products, offering a wide range of skincare, makeup, and body care items.",
        "potentialAction": {
            "@type": "SearchAction",
            "target": {
                "@type": "EntryPoint",
                "urlTemplate": "https://naayiq.com/products?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
        }
    };
    return (
        <>
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{__html: JSON.stringify(jsonLd)}}
            />
            <Dashboard/>
        </>
    );
}