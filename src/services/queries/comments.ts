import type {
  GetCommentsParamsReq,
  GetCommentsRes,
  PostCommentsReq,
  PostCommentsRes,
  DeleteCommentsRes,
} from '@/types/comments';

import AxiosInstance from '../api/axios';

const apiComments = {
  getComments: async (
    id: number,
    params: GetCommentsParamsReq
  ): Promise<GetCommentsRes> => {
    const res = await AxiosInstance.get(`/api/posts/${id}/comments`, {
      params,
    });
    return res.data;
  },

  postComments: async (
    id: number,
    data: PostCommentsReq
  ): Promise<PostCommentsRes> => {
    const res = await AxiosInstance.post(`/api/posts/${id}/comments`, data);
    return res.data;
  },

  deleteComments: async (id: number): Promise<DeleteCommentsRes> => {
    const res = await AxiosInstance.delete(`/api/comments/${id}`);
    return res.data;
  },
};

export default apiComments;
