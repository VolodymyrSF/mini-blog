'use client';

import LoginForm from '@/components/LoginForm';
import Link from 'next/link';

export default function LoginPage() {
    return (
        <div className="max-w-md mx-auto py-16 px-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-8 text-center">Login</h1>
            <LoginForm />
            <p className="mt-6 text-center text-gray-600">
                Don’t have an account?{' '}
                <Link href="/register" className="text-blue-600 hover:underline font-semibold">
                    Register
                </Link>
            </p>
        </div>
    );
}
