'use client'
import React from 'react';
import Image from 'next/image';
import {useRouter} from "next/navigation";

const AddressItem = ({ type, location, phone }) => {
    return (
        <div className="flex justify-between text-base font-medium items-center text-black p-3.5 mb-4 w-full bg-[rgba(246,243,241,0.5)] rounded-lg">
            <div className="space-y-1">
                <h2 className="font-bold text-xl">{type}</h2>
                <p className="">{location}</p>
                <p className="">{phone}</p>
            </div>
            <div className="flex flex-col items-baseline space-x-2">
                <button>
                    <Image src="/address/edit.svg" alt="Edit" width={28} height={28} />
                </button>
                <button>
                    <Image src="/address/delete.svg" alt="Delete" width={28} height={28} />
                </button>
            </div>
        </div>
    );
};
const ManageAddress = () => {
    const addresses = [
        { id: 1, type: 'Home', location: 'Baghdad-alshaab', phone: '0770000000' },
        { id: 2, type: 'Work', location: 'Baghdad-alarasat', phone: '0770000000' },
    ];
    const router = useRouter()
    return (
        <div>
            <header className="flex items-center mb-24">
                <button className="relative z-20" onClick={router.back}>
                    <Image src={"/arrow-left.svg"} width={40} height={40} alt={"left"}/>
                </button>
                <h1 className="text-2xl ssm:text-3xl absolute right-0 left-0 z-10 text-center font-medium font-sans">Manage
                    Address</h1>
            </header>
            <div className="w-full my-20 text-center">
            <button className="py-4 px-14 rounded-lg m-auto font-serif text-center text-white bg-[#3B5345] text-xl"
            onClick={function () {
                router.push("/profile/address/add")
            }}>
                Add a new address
            </button>
            </div>

            <div className="space-y-4 font-serif">
                {addresses.map((address) => (
                    <AddressItem
                        key={address.id}
                        type={address.type}
                        location={address.location}
                        phone={address.phone}
                    />
                ))}
            </div>
        </div>
    );
};
export default ManageAddress;