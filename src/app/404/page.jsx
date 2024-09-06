import AsyncNavBar from "@/components/AsyncNavBar";
import Image from "next/image";

export default function Custom404() {
    return (
        <>
            <AsyncNavBar />
            <div className="h-[50vh] relative flex items-center justify-center w-full">
                <Image src={"/404.png"} alt={"404 Not Found"} className="object-contain" fill={true} priority={true} quality={100} />
            </div>
        </>
    )
}