import type {
  PostFollowRes,
  DeleteFollowRes,
  GetUsersFollowersParamsReq,
  GetUsersFollowersRes,
  GetUsersFollowingParamsReq,
  GetUsersFollowingRes,
  GetMeFollowersParamsReq,
  GetMeFollowersRes,
  GetMeFollowingParamsReq,
  GetMeFollowingRes,
} from '@/types/follow';

import AxiosInstance from '../api/axios';

const apiFollow = {
  postFollow: async (username: string): Promise<PostFollowRes> => {
    const res = await AxiosInstance.post<PostFollowRes>(
      `/api/follow/${username}`
    );
    return res.data;
  },

  deleteFollow: async (username: string): Promise<DeleteFollowRes> => {
    const res = await AxiosInstance.delete<DeleteFollowRes>(
      `/api/follow/${username}`
    );
    return res.data;
  },

  getUsersFollowers: async (
    username: string,
    params: GetUsersFollowersParamsReq
  ): Promise<GetUsersFollowersRes> => {
    const res = await AxiosInstance.get<GetUsersFollowersRes>(
      `/api/users/${username}/followers`,
      { params }
    );
    return res.data;
  },

  getUsersFollowing: async (
    username: string,
    params: GetUsersFollowingParamsReq
  ): Promise<GetUsersFollowingRes> => {
    const res = await AxiosInstance.get<GetUsersFollowingRes>(
      `/api/users/${username}/following`,
      { params }
    );
    return res.data;
  },

  getMeFollowers: async (
    params: GetMeFollowersParamsReq
  ): Promise<GetMeFollowersRes> => {
    const res = await AxiosInstance.get<GetMeFollowersRes>(
      `/api/me/followers`,
      { params }
    );
    return res.data;
  },

  getMeFollowing: async (
    params: GetMeFollowingParamsReq
  ): Promise<GetMeFollowingRes> => {
    const res = await AxiosInstance.get<GetMeFollowingRes>(
      `/api/me/following`,
      { params }
    );
    return res.data;
  },
};

export default apiFollow;
