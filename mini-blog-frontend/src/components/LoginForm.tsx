'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiLogIn } from 'react-icons/fi';

const schema = z.object({
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

type FormData = z.infer<typeof schema>;

export default function LoginForm() {
    const { login, loading, error } = useAuthStore();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        await login(data.email, data.password);
        router.push('/dashboard');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-6 bg-white p-8 rounded-lg shadow-lg">
            {error && <div className="text-red-500 font-semibold">{error}</div>}

            <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <motion.button
                type="submit"
                disabled={loading}
                className={`btn btn-blue w-full justify-center ${loading ? 'btn-disabled' : ''}`}
                whileHover={{ scale: loading ? 1 : 1.05 }}
                whileTap={{ scale: loading ? 1 : 0.95 }}
            >
                <FiLogIn size={20} />
                <span>{loading ? 'Logging in...' : 'Login'}</span>
            </motion.button>
        </form>
    );
}
