import React from 'react';
import Image from 'next/image';

const CustomProduct = ({ title, subtitle, description, bigimg = "/face.png", flower, hideFlower }) => (
    <div className="w-full bg-[#F6F3F180]">
        <p className="text-center font-medium mb-6 font-sans text-[2.4rem] md:text-3xl lg:text-[3em]">{title}</p>
        {!hideFlower && (
            <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
                <Image src={flower} alt="Flower" width={96} height={96} />
            </div>
        )}
        <div className="flex mb-10 w-full justify-center place-content-baseline">
            <div className="flex mt-7 ssm:mt-10 ssm4:mt-16 flex-col w-[35%] justify-stretch items-baseline transform">
                <p className="inline font-sans ssm2:text-3xl mb-7 text-2xl md:text-3xl lg:text-4xl">{subtitle}</p>
                <p className="text-sm sssm:w-[135px] font-serif fig mb-7">{description}</p>
                <p className="text-sm font-serif pb-2 text-[#3B5345] font-bold border-b w-fit border-black inline-block">Show More</p>
            </div>
                <Image
                    src={bigimg}
                    alt="Product Image"
                    width={200}
                    height={250}
                    className="w-[60%] ssm3:w-1/2 sm:w-[40%] -mt-2 mb-12"
                />
        </div>
    </div>
);

export default CustomProduct;
