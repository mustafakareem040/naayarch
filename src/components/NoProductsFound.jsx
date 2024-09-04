import Image from "next/image";

export default function NoProductsFound() {
    return (
        <main className="flex flex-col justify-center items-center">
            <div className="w-full relative h-[50vh]">
                <Image src="/no-product-found.gif"
                       alt="No Products Found"
                       className="object-contain"
                       quality={100}
                       fill={true}
                       priority={true}
                />
            </div>
            <header className="font-semibold font-serif text-center">
                <p className="text-2xl">No Products Found</p>
                <p className="text-base text-black/50 leading-none">So let me play in peace</p>
            </header>
        </main>
    )
}