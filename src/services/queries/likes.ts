import type {
  PostLikeRes,
  DeleteLikeRes,
  GetLikesParamsReq,
  GetLikesRes,
  GetMeLikesParamsReq,
  GetMeLikesRes,
} from '@/types/likes';

import AxiosInstance from '../api/axios';

const apiLikes = {
  postLike: async (id: number): Promise<PostLikeRes> => {
    const res = await AxiosInstance.post(`/api/posts/${id}/like`);
    return res.data;
  },

  deleteLike: async (id: number): Promise<DeleteLikeRes> => {
    const res = await AxiosInstance.delete(`/api/posts/${id}/like`);
    return res.data;
  },

  getLikes: async (
    id: number,
    params: GetLikesParamsReq
  ): Promise<GetLikesRes> => {
    const res = await AxiosInstance.get(`/api/posts/${id}/likes`, {
      params,
    });
    return res.data;
  },

  getMeLikes: async (params: GetMeLikesParamsReq): Promise<GetMeLikesRes> => {
    const res = await AxiosInstance.get(`/api/me/likes`, { params });
    return res.data;
  },
};

export default apiLikes;
