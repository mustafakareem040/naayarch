'use client'
import Image from "next/image";
import {logout} from "@/components/loginAPIs";
import {useRouter} from "next/navigation";

export function Profile() {
    const router = useRouter();
    return (
        <div className="my-28">
            <ProfileItem
                src="/profile/account.svg"
                title="My Account"
                hasNavigate={true}
                alt="My Account"
            />
            <ProfileItem
                src="/profile/orders.svg"
                title="My Orders"
                hasNavigate={true}
                alt="My Orders"
                onClick={function () {
                    router.push("/profile/orders");
                }}
            />
            <ProfileItem
                src="/profile/addresses.svg"
                title="My Addresses"
                hasNavigate={true}
                alt="My Addresses"
            />
            <ProfileItem
                src="/profile/coupons.svg"
                title="My Coupons"
                hasNavigate={true}
                alt="My Coupons"
            />
            <ProfileItem
                src="/profile/logout.svg"
                title="Logout"
                hasNavigate={false}
                alt="Logout"
                onClick={function() {
                    logout().then(function() {
                        router.push("/");
                    });
                }}
            />
        </div>
    );
}

function ProfileItem({src, title, hasNavigate, alt, onClick}) {
    return (
        <button
            className="flex mb-6 justify-between border border-[#3b534580] border-solid rounded-lg py-3 px-4 items-center w-full"
            onClick={onClick}
        >
            <div className="flex items-center space-x-5">
                <Image src={src} width={26} height={26} alt={alt} />
                <p className="font-serif text-black text-xl">{title}</p>
            </div>
            {hasNavigate && <Image src="leftAlt.svg" alt="Navigate" width={10} height={18} />}
        </button>
    );
}