'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { FiUserPlus } from 'react-icons/fi';

const schema = z.object({
    name: z.string().min(2, 'Name is required'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters')
});

type FormData = z.infer<typeof schema>;

export default function RegisterForm() {
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        await registerApi(data.name, data.email, data.password);
        router.push('/login');
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="max-w-sm mx-auto space-y-6 bg-white p-8 rounded-lg shadow-lg">
            <input
                type="text"
                placeholder="Name"
                {...register('name')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.name && <p className="text-red-500">{errors.name.message}</p>}

            <input
                type="email"
                placeholder="Email"
                {...register('email')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.email && <p className="text-red-500">{errors.email.message}</p>}

            <input
                type="password"
                placeholder="Password"
                {...register('password')}
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            {errors.password && <p className="text-red-500">{errors.password.message}</p>}

            <motion.button
                type="submit"
                disabled={isSubmitting}
                className={`btn btn-green w-full justify-center ${isSubmitting ? 'btn-disabled' : ''}`}
                whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
            >
                <FiUserPlus size={20} />
                <span>{isSubmitting ? 'Registering...' : 'Register'}</span>
            </motion.button>
        </form>
    );
}
