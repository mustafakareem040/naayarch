// app/page.js
import Dashboard from "../components/Dashboard";


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