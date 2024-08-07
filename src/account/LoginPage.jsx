import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationContext'; // Make sure to import your context
import '@/components/NotificationStyles.css'

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const router = useRouter();
    const { addNotification } = useNotification(); // Use the context

    const onFinish = async (event) => {
        event.preventDefault();
        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setLoading(false);
        if (email === "admin@gmail.com" && password === "123") {
            addNotification('success', "Successfully Logged in!");
            setHasError(false);
            setDisabled(true);
            router.push("/home");
        } else {
            addNotification('error', 'An error occurred, please try again!');
            setHasError(true);
        }
    };

    const handleFieldChange = () => {
        if (hasError) {
            setHasError(false);
        }
    };

    return (
        <main className="flex-grow my-24 font-serif flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="w-full space-y-6">
                <form onSubmit={onFinish} className="mt-2 space-y-6">
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
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="sr-only" // Hide the default checkbox
                            />
                            <label htmlFor="remember" className="flex items-center cursor-pointer">
                                <div
                                    className={`w-5 h-5 border ${rememberMe ? 'bg-[#44594A] border-[#44594A]' : 'border-gray-300'} rounded mr-2 flex items-center justify-center`}>
                                    {rememberMe && (
                                        <svg className="w-3 h-3 text-white fill-current" viewBox="0 0 20 20">
                                            <path d="M0 11l2-2 5 5L18 3l2 2L7 18z"/>
                                        </svg>
                                    )}
                                </div>
                                <span className="text-[1rem] font-medium text-gray-700">Remember Me</span>
                            </label>
                        </div>
                        <Link href="/forgot-password" className="text-[#44594A] font-medium hover:text-[#374c3d]">
                            Forgot Password?
                        </Link>
                    </div>
                    <div className="mb-4">
                        <button
                            type="submit"
                            className="w-full py-3 font-semibold bg-[#44594A] text-white rounded-md hover:bg-[#374c3d] disabled:bg-gray-400"
                            disabled={loading || disabled}
                        >
                            {loading ? 'Loading...' : 'Login'}
                        </button>
                    </div>
                </form>
                <div className="text-center">
                    <span className="text-black">Don't have an account? </span>
                    <Link href="/signup" className="text-[#44594A] hover:text-[#374c3d]">
                        Sign Up
                    </Link>
                </div>
            </div>
        </main>
    );
}
