'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/useAuthStore';

export const useRequireAuth = () => {
    const { user, fetchMe, loading } = useAuthStore();
    const router = useRouter();

    useEffect(() => {
        // Запускаємо fetchMe один раз при монтуванні
        fetchMe();
    }, [fetchMe]);

    useEffect(() => {
        // Якщо вже завантажено, але юзер не залогінений — редірект на логін
        if (!loading && user === null) {
            router.push('/login');
        }
    }, [user, loading, router]);

    return user;
};
