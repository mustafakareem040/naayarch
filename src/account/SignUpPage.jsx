'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useNotification } from '@/components/NotificationContext';
import '@/components/NotificationStyles.css';
import setCookies, {signUp} from "@/components/loginAPIs";

export default function SignUpPage() {
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [phone, setPhone] = useState('');
    const router = useRouter();
    const { addNotification } = useNotification(); // Use the context

    const onFinish = async (event) => {
        event.preventDefault();
        setLoading(true);
        setHasError(false);

        try {
            const response = await signUp(fullName, email, password, phone);

            if (response.ok) {
                setCookies(await response.json(), false, true)
                addNotification('success', 'Successfully signed up!');
                router.push('/');
            }
            else {
                const errorData = await response.json();
                addNotification('error', errorData.message)
                setHasError(true)
            }
        } catch (error) {
            if (error.response) {
                addNotification('error', error.response.message);
                setHasError(true);
            }
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = () => {
        if (hasError) {
            setHasError(false);
        }
    };

    return (
        <main className="flex-grow my-24 flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full font-serif space-y-6">
                <div className="space-y-2">
                    <h3 className="text-3xl text-center font-sans">Create an account</h3>
                    <p className="text-center text-[1rem]">Let&apos;s together make your skin glow.</p>
                </div>
                <form onSubmit={onFinish} className="mt-2">
                    <div className="mb-4">
                        <label className="block text-[#695C5C] mb-2" htmlFor="fullName">Full Name</label>
                        <input
                            id="fullName"
                            type="text"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            onInput={handleFieldChange}
                            placeholder="Full Name"
                            className={`w-full borderblack40 p-3 ${hasError ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[#695C5C] mb-2" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onInput={handleFieldChange}
                            placeholder="example@gmail.com"
                            className={`w-full borderblack40 p-3 ${hasError ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-[#695C5C] mb-2" htmlFor="phone">Phone</label>
                        <input
                            id="phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            onInput={handleFieldChange}
                            placeholder="077xxx"
                            className={`w-full p-3 borderblack40 ${hasError ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-[#695C5C] mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onInput={handleFieldChange}
                            placeholder="Enter Your Password"
                            className={`w-full borderblack40 p-3 ${hasError ? 'border-red-500' : ''}`}
                        />
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold bg-[#44594A] text-white rounded-md hover:bg-[#374c3d] disabled:bg-gray-400"
                            disabled={loading}
                        >
                            {loading ? 'Loading...' : 'Sign Up'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <span className="text-black">Already have an account? </span>
                    <Link href="/login" className="text-[#44594A] hover:text-[#374c3d]">
                        Login
                    </Link>
                </div>
            </div>
        </main>
    );
}
