'use client';

import { useRequireAuth } from '@/hooks/useRequireAuth';
import PostList from '@/components/PostList';
import Link from 'next/link';
import { useAuthStore } from '@/stores/useAuthStore';
import { motion } from 'framer-motion';
import { FiPlus, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function DashboardPage() {
    const user = useAuthStore((state) => state.user);
    const logout = useAuthStore((state) => state.logout);
    const router = useRouter();

    const [isLoggingOut, setIsLoggingOut] = useState(false);

    if (!user) return <p className="text-center py-10">Loading...</p>;

    const logoutHandler = async () => {
        setIsLoggingOut(true);
        await logout();
        setIsLoggingOut(false);
        router.push('/login');
    };

    return (
        <main className="max-w-3xl mx-auto py-12 px-4">
            <header className="flex justify-between items-center mb-12">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">My Posts</h1>

                <nav className="flex space-x-4">
                    <motion.div
                        whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(34,197,94,0.7)' }}
                        whileTap={{ scale: 0.95 }}
                        className="rounded-lg"
                    >
                        <Link
                            href="/posts/create"
                            className="flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg shadow hover:bg-green-700 transition font-semibold"
                        >
                            <FiPlus size={20} />
                            <span>Create Post</span>
                        </Link>
                    </motion.div>

                    <motion.button
                        onClick={logoutHandler}
                        whileHover={{ scale: 1.05, boxShadow: '0 0 12px rgba(220,38,38,0.7)' }}
                        whileTap={{ scale: 0.95 }}
                        disabled={isLoggingOut}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow font-semibold
                          ${isLoggingOut
                            ? 'bg-red-400 cursor-not-allowed'
                            : 'bg-red-600 hover:bg-red-700 text-white'}`}
                    >
                        <FiLogOut size={20} />
                        <span>{isLoggingOut ? 'Logging out...' : 'Logout'}</span>
                    </motion.button>
                </nav>
            </header>

            <PostList />
        </main>
    );
}
