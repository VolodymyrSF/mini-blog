export type UserDto = {
    userId: string;
    email: string;
    name: string;
};

export type Post = {
    id: string;
    title: string;
    content: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

export type PostCreateDto = {
    title: string;
    content: string;
};

export type PostListResponse = {
    data: Post[];
    meta: {
        total: number;
        page: number;
        limit: number;
    };
};
