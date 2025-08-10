
import { create } from 'zustand';
import { getMeApi, loginApi, logoutApi, refreshApi } from '@/lib/api';

type User = {
    id: string;
    email: string;
    name: string;
};

type AuthState = {
    user: User | null;
    loading: boolean;
    error: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    fetchMe: () => Promise<void>;
    refresh: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
    user: null,
    loading: false,
    error: null,

    login: async (email, password) => {
        set({ loading: true, error: null });
        try {
            await loginApi(email, password);
            await useAuthStore.getState().fetchMe();
        } catch (err: any) {
            set({ error: err.response?.data?.message || 'Login failed' });
        } finally {
            set({ loading: false });
        }
    },

    logout: async () => {
        try {
            await logoutApi();
            set({ user: null });
        } catch {

        }
    },

    fetchMe: async () => {
        set({ loading: true });
        try {
            const { data } = await getMeApi();
            set({ user: data });
        } catch {
            set({ user: null });
        } finally {
            set({ loading: false });
        }
    },

    refresh: async () => {
        try {
            await refreshApi();
            await useAuthStore.getState().fetchMe();
        } catch {
            set({ user: null });
        }
    }
}));
