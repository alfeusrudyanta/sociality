import type {
  GetUsersLikesParamsReq,
  GetUsersLikesRes,
  GetUsersPostsParamsReq,
  GetUsersPostsRes,
  GetUsersSearchParamsReq,
  GetUsersSearchRes,
  GetUsersRes,
} from '@/types/users';

import AxiosInstance from '../api/axios';

const apiUsers = {
  getUsersLikes: async (
    username: string,
    params: GetUsersLikesParamsReq
  ): Promise<GetUsersLikesRes> => {
    const res = await AxiosInstance.get(`/api/users/${username}/likes`, {
      params,
    });
    return res.data;
  },

  getUsersPosts: async (
    username: string,
    params: GetUsersPostsParamsReq
  ): Promise<GetUsersPostsRes> => {
    const res = await AxiosInstance.get(`/api/users/${username}/posts`, {
      params,
    });
    return res.data;
  },

  getUsersSearch: async (
    params: GetUsersSearchParamsReq
  ): Promise<GetUsersSearchRes> => {
    const res = await AxiosInstance.get('/api/users/search', { params });
    return res.data;
  },

  getUsers: async (username: string): Promise<GetUsersRes> => {
    const res = await AxiosInstance.get(`/api/users/${username}`);
    return res.data;
  },
};

export default apiUsers;
