import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from "next/link";
import Image from "next/image";

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        // TODO: Implement password reset logic
        await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating API call
        setLoading(false);
        // TODO: Handle success or error
    };

    return (
        <main>
            <div className="w-full mb-24 font-serif space-y-8">
                <div className="text-left">
                    <Link href="/login" className="flex mt-6 w-full items-center text-[#44594A] hover:text-[#374c3d]">
                        <Image src="/arrow-left.svg" alt={"arrow-left"} width={40} height={40}/>
                        <h2 className="text-2xl absolute transform left-0 right-0 font-sans font-medium text-center text-gray-900">
                            Forgot password
                        </h2>
                    </Link>
                </div>
                <div>
                    <p className="mt-16 text-center text-sm text-gray-600">
                    Please enter your email to reset the password
                    </p>
                </div>
                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                            Your Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-[#44594A] focus:border-[#44594A] focus:z-10 sm:text-sm"
                            placeholder="example@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                        <button
                            type="submit"
                            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-[#44594A] hover:bg-[#374c3d] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#44594A]"
                            disabled={loading}
                        >
                            {loading ? 'Processing...' : 'Reset Password'}
                        </button>
                </form>
            </div>
        </main>
    );
};

export default ForgotPasswordPage;