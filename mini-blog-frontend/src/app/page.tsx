/**
 * Лендінг / редірект.
 * Якщо користувач залогінений — веде на dashboard, інакше на login.
 */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export default function HomePage() {
    const { user, fetchMe } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        const init = async () => {
            await fetchMe();
        };
        init();
    }, [fetchMe]);

    useEffect(() => {
        if (user) {
            router.push('/dashboard');
        } else {
            router.push('/login');
        }
    }, [user, router]);

    return <p>Loading...</p>;
}
