'use client';
import Image from "next/image";
import { logout } from "@/components/loginAPIs";
import Link from "next/link";

export function Profile() {
    const profileItems = [
        {
            src: "/profile/account.svg",
            title: "My Account",
            hasNavigate: true,
            alt: "My Account",
            href: "/profile/account",
        },
        {
            src: "/profile/orders.svg",
            title: "My Orders",
            hasNavigate: true,
            alt: "My Orders",
            href: "/profile/orders",
        },
        {
            src: "/profile/addresses.svg",
            title: "My Addresses",
            hasNavigate: true,
            alt: "My Addresses",
            href: "/profile/address",
        },
        {
            src: "/profile/coupons.svg",
            title: "My Coupons",
            hasNavigate: true,
            alt: "My Coupons",
            href: "/profile/coupons",
        },
        {
            src: "/profile/logout.svg",
            title: "Logout",
            hasNavigate: false,
            alt: "Logout",
            onClick: logout,
            href: "/",
        },
    ];

    return (
        <div className="flex flex-col items-center space-y-6">
            {profileItems.map((item, index) => (
                <ProfileItem key={index} {...item} />
            ))}
        </div>
    );
}

function ProfileItem({ src, title, hasNavigate, alt, onClick, href = "/" }) {
    return (
        <Link
            href={href}
            prefetch={false}
            onClick={onClick}
            className="flex w-full max-w-md mx-2 px-4 py-3 border border-[#3b534580] rounded-lg items-center justify-between hover:bg-gray-100 transition-colors duration-200"
            aria-label={title}
        >
            <div className="flex items-center space-x-5">
                <Image src={src} width={26} height={26} alt={alt} />
                <p className="font-serif text-black text-xl">{title}</p>
            </div>
            {hasNavigate && (
                <Image
                    src="https://storage.naayiq.com/resources/leftAlt.svg"
                    alt="Navigate"
                    width={10}
                    height={18}
                />
            )}
        </Link>
    );
}