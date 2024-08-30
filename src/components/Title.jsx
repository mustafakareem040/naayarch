import Link from "next/link";

export default function Title({title}) {
    return (
        <header className="flex items-center mb-6">
            <Link className="relative z-20" href={"/"}>
                <img src="/arrow-left.svg" width={40} height={40} alt="left"/>
            </Link>
            <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                {title}
            </h1>
        </header>
    )
}