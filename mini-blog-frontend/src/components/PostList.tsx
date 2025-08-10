'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getMyPostsApi, deletePostApi } from '@/lib/api';
import PostCard from './PostCard';
import Pagination from './Pagination';
import Link from 'next/link';
import { AnimatePresence } from 'framer-motion';

export default function PostList() {
    const [page, setPage] = useState(1);
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery({
        queryKey: ['myPosts', page],
        queryFn: () => getMyPostsApi(page).then((res) => res.data)
    });

    const handleDelete = async (id: string) => {
        await deletePostApi(id);
        queryClient.invalidateQueries({ queryKey: ['myPosts', page] });
    };

    if (isLoading) return <p className="text-center py-10">Loading...</p>;
    if (isError) return <p className="text-center py-10 text-red-600">Error loading posts</p>;

    if (!data || data.posts.length === 0) {
        return (
            <div className="text-center py-10">
                <p className="mb-4 text-gray-600">You have no posts yet.</p>
                <Link
                    href="/posts/create"
                    className="inline-block bg-green-600 text-white px-5 py-3 rounded-md hover:bg-green-700 transition font-semibold shadow-md"
                >
                    Create your first post
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <AnimatePresence>
                {data.posts.map((post: any) => (
                    <PostCard key={post.id} {...post} date={post.createdAt} onDelete={handleDelete} />
                ))}
            </AnimatePresence>

            <Pagination currentPage={page} totalPages={data.totalPages || 1} onPageChange={setPage} />
        </div>
    );
}
