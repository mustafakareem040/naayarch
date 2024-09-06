import AsyncNavBar from "@/components/AsyncNavBar";
import Image from "next/image";

export default function Custom404() {
    return (
        <>
            <AsyncNavBar />
            <div className="h-[65vh] relative translate-y-[30%] w-full">
                <Image unoptimized={true} src={"https://storage.naayiq.com/resources/404.png"} alt={"404 Not Found"} className="object-contain" fill={true} priority={true} quality={100} />
            </div>
        </>
    )
}