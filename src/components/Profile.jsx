'use client'
import Image from "next/image";
import {logout} from "@/components/loginAPIs";
import {redirect, useRouter} from "next/navigation";
import Link from "next/link";

export function Profile() {
    const router = useRouter();
    // if (getToken() === undefined) {
    //     redirect("/login")
    // }
    return (
        <div className="my-28">
            <ProfileItem
                src="/profile/account.svg"
                title="My Account"
                hasNavigate={true}
                alt="My Account"
                href={"/profile/account"}
            />
            <ProfileItem
                src="/profile/orders.svg"
                title="My Orders"
                hasNavigate={true}
                alt="My Orders"
                href={"/profile/orders"}
            />
            <ProfileItem
                src="/profile/addresses.svg"
                title="My Addresses"
                hasNavigate={true}
                alt="My Addresses"
                href={"/profile/address"}
            />
            <ProfileItem
                src="/profile/coupons.svg"
                title="My Coupons"
                hasNavigate={true}
                alt="My Coupons"
                href={"/profile/coupons"}
            />
            <ProfileItem
                src="/profile/logout.svg"
                title="Logout"
                hasNavigate={false}
                alt="Logout"
                onClick={logout}
                href={"/"}
            />
        </div>
    );
}

function ProfileItem({src, title, hasNavigate, alt, onClick, href="/"}) {
    return (
        <Link
            className="flex mx-2 mb-6 justify-between border border-[#3b534580] border-solid rounded-lg py-3 px-4 items-center"
            onClick={onClick}
            href={href}
            prefetch={false}>
            <div className="flex items-center space-x-5">
                <Image src={src} width={26} height={26} alt={alt} />
                <p className="font-serif text-black text-xl">{title}</p>
            </div>
            {hasNavigate && <Image unoptimized={true} src="https://storage.naayiq.com/resources/leftAlt.svg" alt="Navigate" width={10} height={18} />}
        </Link>
    );
}