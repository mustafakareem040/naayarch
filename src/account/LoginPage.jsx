'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useNotification } from '@/components/NotificationContext';
import '@/components/NotificationStyles.css';
import { Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [disabled, setDisabled] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [rememberMe, setRememberMe] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { addNotification } = useNotification();

    const onFinish = async (event) => {
        event.preventDefault();
        setLoading(true);

        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API}/user/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password, rememberMe }),
            });

            if (response.ok) {
                const data = await response.json();
                localStorage.setItem('token', data.token);
                localStorage.setItem('userData', JSON.stringify(data));
                localStorage.setItem('addresses', JSON.stringify(data.address))
                addNotification('success', 'Successfully Logged in!');
                setHasError(false);
                setDisabled(true);
                setTimeout(() => router.push("/"), 3000);
            } else {
                const errorData = await response.json();
                addNotification('error', errorData.message || 'Login failed');
                setHasError(true);
                setDisabled(true);
                setTimeout(() => setDisabled(false), 100);
            }
        } catch (error) {
            addNotification('error', 'An error occurred, please try again!');
            setHasError(true);
            setDisabled(true);
            setTimeout(() => setDisabled(false), 100);
        } finally {
            setLoading(false);
        }
    };

    const handleFieldChange = () => {
        if (hasError) {
            setHasError(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
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
                    <div className="mb-4 relative">
                        <label className="block text-[#695C5C] mb-2" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onInput={handleFieldChange}
                            placeholder="Enter Your Password"
                            className={`w-full borderblack40 p-3 ${hasError ? 'border-red-500' : ''}`}
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-12 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                        </button>
                    </div>
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center">
                            <input
                                id="remember"
                                type="checkbox"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="sr-only"
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
                    <span className="text-black">Don&apos;t have an account? </span>
                    <Link prefetch={false} href="/signup" className="text-[#44594A] font-semibold hover:text-[#374c3d]">
                        Sign Up
                    </Link>
                </div>
            </div>
        </main>
    );
}