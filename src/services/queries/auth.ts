import type {
  PostRegisterReq,
  PostRegisterRes,
  PostLoginReq,
  PostLoginRes,
} from '@/types/auth';

import AxiosInstance from '../api/axios';

const apiAuth = {
  postRegister: async (data: PostRegisterReq): Promise<PostRegisterRes> => {
    const res = await AxiosInstance.post('/api/auth/register', data);
    return res.data;
  },

  postLogin: async (data: PostLoginReq): Promise<PostLoginRes> => {
    const res = await AxiosInstance.post('/api/auth/login', data);
    return res.data;
  },
};

export default apiAuth;
