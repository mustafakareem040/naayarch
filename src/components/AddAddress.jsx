'use client'
import React, { useState } from 'react';
import {HomeIcon, PlusCircleIcon} from 'lucide-react';
import Image from "next/image";
import {useRouter} from "next/navigation";


export default function AddAddress() {
    const [addressType, setAddressType] = useState('');
    const router = useRouter()

    return (
        <div className="bg-white font-sans">
            <div className="flex items-center mb-6">
                <button onClick={router.back} className="relative z-20">
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-bold">
                    Add Address
                </h1>
            </div>

            <div className="p-4">
                <div className="flex font-medium space-x-2 mb-4">
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "home" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("home")}
                    >
                        <HomeIcon className="mr-2 h-4 w-4"/> Home
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "work" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("work")}
                    >
                        <Image src={"https://storage.naayiq.com/resources/work.svg"} unoptimized={true} width={16} height={16} className="mr-2" alt={"work"}/> Work
                    </button>
                    <button
                        className={`flex-1 flex items-center justify-center px-4 py-2 border rounded-md ${
                            addressType === "other" ? 'bg-[#3B5345] text-white' : 'bg-white text-black'
                        }`}
                        onClick={() => setAddressType("other")}
                    >
                        <PlusCircleIcon className="mr-2 h-4 w-4"/> Other
                    </button>
                </div>

                <form className="space-y-4 font-serif font-normal">
                    <input className="w-full p-3 border rounded-md" placeholder="Full Name"/>
                    <select className="w-full p-3 border bg-white rounded-md appearance-none">
                        <option value="" disabled={true} selected={true} hidden={true}>Governate</option>
                        <option value="baghdad">Baghdad</option>
                        <option value="basra">Basra</option>
                        <option value="mosul">Mosul</option>
                    </select>
                    <input className="w-full p-3 border rounded-md" placeholder="City"/>
                    <input className="w-full p-3 border rounded-md" placeholder="Address"/>
                    <input className="w-full p-3 border rounded-md" placeholder="The closest point of a function"/>
                    <input className="w-full p-3 border rounded-md" placeholder="Phone Number"/>
                    <button className="w-full p-3 bg-[#3B5345] text-white rounded-md">
                        Save
                    </button>
                </form>
            </div>
        </div>
    );
}