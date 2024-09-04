export default function NoProductsFound() {
    return (
        <main className="flex flex-col justify-center items-center">
            <div className="w-full h-[50vh]">
                <Image src="/no-product-found.gif"
                       alt="No Products Found"
                       quality={100}
                       fill={true}
                       priority={true}
                />
            </div>
            <header>
                <p className="font-semibold text-2xl leading-none">No Products Found</p>
                <p className="font-semibold text-base text-2xl text-opacity-50 leading-none">So let me play in peace</p>
            </header>
        </main>
    )
}