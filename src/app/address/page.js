import React from 'react';
import Footer from "@/components/Footer";
import AddressComponent from "@/components/AddressComponent";

export default function AddressesPage() {
    return (
        <div className="h-screen flex flex-col justify-between">
            <AddressComponent />
            <Footer />
        </div>
    );
}