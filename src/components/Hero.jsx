import Image from 'next/image';
import Link from 'next/link';

export default function Hero({subtitle}) {
    return (
        <section className="relative mb-12 font-sans w-full h-[550px] overflow-hidden rounded-lg">
            <Image
                src="https://storage.naayiq.com/resources/water.webp"
                alt="Ice texture"
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                priority={true}
                className="object-cover"
            />
            <div className="absolute font-serif -top-36 mr-1 ssm:-top-24 font-medium text-center inset-0 transform right-0 left-1/2 flex flex-col items-center justify-center space-y-4">
                <h1 className="text-2xl max-w-[8.35rem] mb-4 font-serif text-white ">
                    Welcome to Naay Iraq
                </h1>
                <Link
                    href="/products"
                    className="px-6 font-serif text-sm sssm:text-[1em] ssm:text-xl py-[0.535rem] border-white border-[1px] border-solid bg-white bg-opacity-50 black rounded-[20px] backdrop-blur-sm hover:bg-opacity-30 transition-colors"
                >
                    Shop Now
                </Link>
            </div>
        </section>
    );
}
