import { api } from './client';
import type { Post } from '@/types/Post';
import type { PaginatedResponse } from '@/types/Api';

export const fetchPosts = async ({ limit = 100 }: { limit?: number }) => {
  const { data } = await api.get<PaginatedResponse<Post>>('/api/posts', {
    params: { _limit: limit, _page: 1 },
  });
  return data;
};

export const fetchPost = async (id: number) => {
  const { data } = await api.get<Post>(`/api/posts/${id}`);
  return data;
};

export const createPost = async (payload: {
  userId: number;
  title: string;
  body: string;
  category?: string;
  tags?: string[];
}): Promise<Post> => {
  const { data } = await api.post<Post>('/api/posts', {
    category: 'Chat',
    tags: [],
    ...payload,
  });
  return data;
};
