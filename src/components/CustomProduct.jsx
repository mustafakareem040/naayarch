import React from 'react';
import Image from 'next/image';

const CustomProduct = ({ title, subtitle, description, bigimg = "/face.png", flower, hideFlower }) => (
    <div className="white p-4 mb-12">
        <p className="text-center font-medium font-sans text-3xl ssm:text-[2.4rem] md:text-3xl lg:text-[3em]">{title}</p>
        {!hideFlower && (
            <div className="absolute left-[45%] sm:left-1/2 rounded-3xl transform -translate-x-1/2 z-10">
                <Image src={flower} className="rounded-3xl" alt="Flower" width={96} height={96} />
            </div>
        )}
        <div className={`flex gap-2 w-full justify-center place-content-baseline ${hideFlower ? "mt-2 mb-16 ssm:mb-2" : "mt-16"}`}>
            <div className={`flex mt-7 ssm:mt-10 ssm4:mt-16 flex-col w-[35%] justify-stretch items-baseline transform ${hideFlower ? "": "relative bottom-8"}`}>
                <p className="inline font-sans ssm2:text-3xl mb-7 text-2xl md:text-3xl lg:text-4xl">{subtitle}</p>
                <p className="text-sm font-serif fig mb-7">{description}</p>
                <p className="text-sm font-serif pb-2 text-[#3B5345] font-bold border-b w-fit border-[#695C5C] inline-block">Show More</p>
            </div>
                <Image
                    src={bigimg}
                    alt="Product Image"
                    width={200}
                    height={250}
                    className="w-[60%] object-cover ssm3:w-1/2 sm:w-[40%] -mt-2 mb-12"
                />
        </div>
    </div>
);

export default CustomProduct;
