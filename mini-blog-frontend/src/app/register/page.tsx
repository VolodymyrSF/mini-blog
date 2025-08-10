'use client';

import RegisterForm from '@/components/RegisterForm';
import Link from 'next/link';

export default function RegisterPage() {
    return (
        <div className="max-w-md mx-auto py-16 px-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-8 text-center">Register</h1>
            <RegisterForm />
            <p className="mt-6 text-center text-gray-600">
                Already have an account?{' '}
                <Link href="/login" className="text-blue-600 hover:underline font-semibold">
                    Login
                </Link>
            </p>
        </div>
    );
}
