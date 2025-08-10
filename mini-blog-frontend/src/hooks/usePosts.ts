
'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMyPostsApi, createPostApi, deletePostApi } from '@/lib/api';

export function usePosts(page: number) {
    return useQuery({
        queryKey: ['myPosts', page],
        queryFn: () => getMyPostsApi(page).then((res) => res.data)
    });
}

export function useCreatePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (data: { title: string; content: string }) =>
            createPostApi(data.title, data.content),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myPosts'] });
        }
    });
}

export function useDeletePost() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: string) => deletePostApi(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myPosts'] });
        }
    });
}
