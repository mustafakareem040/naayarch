import Image from "next/image";

export function Profile() {
    return (
        <>
            <ProfileItem src={"/profile/account.svg"}
                         title={"My Account"}
                         hasNavigate={true}
                         alt={"My Orders"} />
            <ProfileItem src={"/profile/orders.svg"}
                         title={"My Orders"}
                         hasNavigate={true}
                         alt={"My Orders"} />
            <ProfileItem src={"/profile/addresses.svg"}
                         title={"My Addresses"}
                         hasNavigate={true}
                         alt={"My Addresses"} />
            <ProfileItem src={"/profile/coupons.svg"}
                         title={"My Coupons"}
                         hasNavigate={true}
                         alt={"My Coupons"} />
            <ProfileItem src={"/profile/logout.svg"}
                         title={"Logout"}
                         hasNavigate={false}
                         alt={"Logout"} />
        </>
    )
}


function ProfileItem({src, title, hasNavigate, alt}) {
    return (
        <div className="flex mb-6 justify-between  border border-[#3b534580] border-solid rounded-lg py-3 px-4 items-center w-full">
            <div className="flex items-center space-x-5">
                <Image src={src} width={26} height={26} alt={alt}/>
                <p className="font-serif text-black text-xl">{title}</p>
            </div>
            {hasNavigate && <Image src={"leftAlt.svg"} alt={"Navigate"} width={10} height={18} />}
        </div>
    )
}