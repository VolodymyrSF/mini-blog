'use client';

import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { createPostApi } from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useRequireAuth } from '@/hooks/useRequireAuth';
import { motion } from 'framer-motion';
import { FiEdit } from 'react-icons/fi';

const schema = z.object({
    title: z.string().min(3, 'Title is required'),
    content: z.string().min(10, 'Content must be at least 10 characters')
});

type FormData = z.infer<typeof schema>;

export default function CreatePostPage() {
    useRequireAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting }
    } = useForm<FormData>({
        resolver: zodResolver(schema)
    });

    const onSubmit = async (data: FormData) => {
        await createPostApi(data.title, data.content);
        router.push('/dashboard');
    };

    return (
        <div className="max-w-md mx-auto py-16 px-8 bg-white rounded-lg shadow-lg">
            <h1 className="text-3xl font-extrabold mb-8 text-center">Create New Post</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <input
                    type="text"
                    placeholder="Title"
                    {...register('title')}
                    className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                {errors.title && <p className="text-red-500">{errors.title.message}</p>}

                <textarea
                    placeholder="Content"
                    {...register('content')}
                    className="w-full p-3 border border-gray-300 rounded-md min-h-[180px] focus:outline-none focus:ring-2 focus:ring-blue-500 whitespace-pre-wrap"
                />
                {errors.content && <p className="text-red-500">{errors.content.message}</p>}

                <motion.button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn btn-blue w-full justify-center ${isSubmitting ? 'btn-disabled' : ''}`}
                    whileHover={{ scale: isSubmitting ? 1 : 1.05 }}
                    whileTap={{ scale: isSubmitting ? 1 : 0.95 }}
                >
                    <FiEdit size={20} />
                    <span>{isSubmitting ? 'Creating...' : 'Create Post'}</span>
                </motion.button>
            </form>
        </div>
    );
}
