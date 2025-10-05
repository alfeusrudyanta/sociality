import type {
  PostPostsReq,
  PostPostsRes,
  GetPostsRes,
  DeletePostsRes,
} from '@/types/posts';

import AxiosInstance from '../api/axios';

const apiPosts = {
  postPosts: async (data: PostPostsReq): Promise<PostPostsRes> => {
    const body = new FormData();
    body.append('image', data.image);
    body.append('caption', data.caption);

    const res = await AxiosInstance.post<PostPostsRes>('/api/posts', body, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  getPosts: async (id: number): Promise<GetPostsRes> => {
    const res = await AxiosInstance.get<GetPostsRes>(`/api/posts/${id}`);
    return res.data;
  },

  deletePosts: async (id: number): Promise<DeletePostsRes> => {
    const res = await AxiosInstance.delete<DeletePostsRes>(`/api/posts/${id}`);
    return res.data;
  },
};

export default apiPosts;
