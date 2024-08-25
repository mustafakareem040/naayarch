'use client'
import React, { useState } from 'react';
import { ChevronLeft, Mail, Phone, Lock } from 'lucide-react';
import Image from "next/image";
import {useRouter} from "next/navigation";

const MyAccount = () => {
    const [dateOfBirth, setDateOfBirth] = useState({ month: '', day: '', year: '' });

    const handleDateChange = (field, value) => {
        setDateOfBirth(prev => ({ ...prev, [field]: value }));
    };
    const router = useRouter()
    return (
        <div className="bg-white min-h-screen p-6 flex flex-col">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={router.back}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1
                    className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    My Account
                </h1>
            </header>

            <form className="flex-1 font-serif flex flex-col">
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">First
                            Name</label>
                        <input type="text" id="firstName" className="w-full p-3 border border-gray-300 rounded-lg"
                               placeholder="Duaa"/>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                        <input type="text" id="lastName" className="w-full p-3 border border-gray-300 rounded-lg" placeholder="Kareem" />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="email" id="email" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" placeholder="Duaakareem97@Gmail.com" />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="tel" id="phone" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" placeholder="07700000000" />
                    </div>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-600 mb-1">Date Of Birth</label>
                    <div className="grid grid-cols-3 gap-2">
                        <select
                            className="p-3 border bg-white border-gray-300 rounded-lg"
                            value={dateOfBirth.month}
                            onChange={(e) => handleDateChange('month', e.target.value)}
                        >
                            <option value="">Month</option>
                            {Array.from({ length: 12 }, (_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select
                            className="p-3 bg-white border border-gray-300 rounded-lg"
                            value={dateOfBirth.day}
                            onChange={(e) => handleDateChange('day', e.target.value)}
                        >
                            <option value="">Day</option>
                            {Array.from({ length: 31 }, (_, i) => (
                                <option key={i} value={i + 1}>{i + 1}</option>
                            ))}
                        </select>
                        <select
                            className="p-3 bg-white border border-gray-300 rounded-lg"
                            value={dateOfBirth.year}
                            onChange={(e) => handleDateChange('year', e.target.value)}
                        >
                            <option value="">Year</option>
                            {Array.from({ length: 100 }, (_, i) => {
                                const year = new Date().getFullYear() - i;
                                return <option key={year} value={year}>{year}</option>;
                            })}
                        </select>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium text-gray-600 mb-1">New Password</label>
                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="password" id="newPassword" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" placeholder="••••••••" />
                    </div>
                </div>

                <button type="submit" className="mt-auto bg-[#3B5345] text-white py-4 rounded-md text-lg font-bold">
                    Save
                </button>
            </form>
        </div>
    );
};

export default MyAccount;