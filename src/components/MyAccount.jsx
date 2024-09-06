'use client'
import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, Mail, Phone, Lock } from 'lucide-react';
import Image from "next/image";
import { useRouter } from "next/navigation";
import Loading from "@/components/Loading";

const MyAccount = () => {
    const [user, setUser] = useState(null);
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [dateOfBirth, setDateOfBirth] = useState({ month: '', day: '', year: '' });
    const router = useRouter();

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await fetch('https://api.naayiq.com/user/check-auth',
                {credentials: "include"});
            const data = await response.json();
            if (data.isAuthenticated) {
                setUser(data);
                if (data.dob) {
                    const [year, month, day] = data.dob.split('-');
                    setDateOfBirth({
                        year,
                        month: month.replace(/^0/, ''), // Remove leading zero
                        day: day.replace(/^0/, '')      // Remove leading zero
                    });
                } else {
                    setDateOfBirth({ year: '', month: '', day: '' });
                }
            } else {
                router.push("/login");
            }
        } catch (error) {
            console.error('Error fetching user info:', error);
            router.push("/login")
        }
    }, [router]);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);

    const handleDateChange = (field, value) => {
        setDateOfBirth(prev => ({ ...prev, [field]: value.replace(/^0/, '') }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== repeatPassword) {
            alert("Passwords don't match");
            return;
        }

        // Prepare the update data
        const updateData = {
            name: `${e.target.firstName.value} ${e.target.lastName.value}`,
            email: e.target.email.value,
            phone: e.target.phone.value,
        };

        // Only include DOB if all fields are filled
        if (dateOfBirth.year && dateOfBirth.month && dateOfBirth.day) {
            const month = dateOfBirth.month.toString().padStart(2, '0');
            const day = dateOfBirth.day.toString().padStart(2, '0');
            updateData.dob = `${dateOfBirth.year}-${month}-${day}`;
        }

        // Only include password if a new one is set
        if (newPassword) {
            updateData.password = newPassword;
        }

        try {
            const response = await fetch(`https://api.naayiq.com/user/${user.userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
                credentials: "include"
            });

            if (response.ok) {
                alert('Information updated successfully');
                fetchUserInfo(); // Refresh user data after successful update
            } else {
                const errorData = await response.json();
                if (errorData.errors && errorData.errors.length > 0) {
                    const errorMessages = errorData.errors.map(err => `${err.path}: ${err.msg}`).join('\n');
                    alert(`Failed to update information:\n${errorMessages}`);
                } else {
                    alert('Failed to update information: Unknown error');
                }
            }
        } catch (error) {
            console.error('Error updating user info:', error);
            alert('An error occurred while updating information');
        }
    };

    if (!user) return <Loading />;

    return (
        <div className="bg-white min-h-screen p-6 flex flex-col">
            <header className="flex items-center mb-6">
                <button className="relative z-20" onClick={() => router.back()}>
                    <Image src="/arrow-left.svg" width={40} height={40} alt="left"/>
                </button>
                <h1 className="text-3xl z-10 text-[#181717] left-0 right-0 absolute font-sans text-center font-medium">
                    My Account
                </h1>
            </header>
            <form className="flex-1 font-serif flex flex-col" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                        <label htmlFor="firstName" className="block text-sm font-medium text-gray-600 mb-1">First Name</label>
                        <input type="text" id="firstName" className="w-full p-3 border border-gray-300 rounded-lg" defaultValue={user.name.split(' ')[0]}/>
                    </div>
                    <div>
                        <label htmlFor="lastName" className="block text-sm font-medium text-gray-600 mb-1">Last Name</label>
                        <input type="text" id="lastName" className="w-full p-3 border border-gray-300 rounded-lg" defaultValue={user.name.split(' ')[1] || ''}/>
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="email" id="email" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" defaultValue={user.email} />
                    </div>
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-600 mb-1">Phone Number</label>
                    <div className="relative">
                        <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <input type="tel" id="phone" className="w-full pl-10 p-3 border border-gray-300 rounded-lg" defaultValue={user.phone} />
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
                        <input
                            type="password"
                            id="newPassword"
                            className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                            placeholder="••••••••"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                    </div>
                </div>

                {newPassword && (
                    <div className="mb-4">
                        <label htmlFor="repeatPassword" className="block text-sm font-medium text-gray-600 mb-1">Repeat the New Password</label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                            <input
                                type="password"
                                id="repeatPassword"
                                className="w-full pl-10 p-3 border border-gray-300 rounded-lg"
                                placeholder="••••••••"
                                value={repeatPassword}
                                onChange={(e) => setRepeatPassword(e.target.value)}
                            />
                        </div>
                    </div>
                )}

                <button type="submit" className="mt-auto bg-[#3B5345] text-white py-4 rounded-md text-lg font-bold">
                    Save
                </button>
            </form>
        </div>
    );
};

export default MyAccount;