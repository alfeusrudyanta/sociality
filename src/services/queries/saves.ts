import type {
  PostPostsSaveRes,
  DeletePostsSaveRes,
  GetMeSavedParamsReq,
  GetMeSavedRes,
} from '@/types/saves';

import AxiosInstance from '../api/axios';

const apiSaves = {
  postSave: async (id: number): Promise<PostPostsSaveRes> => {
    const res = await AxiosInstance.post(`/api/posts/${id}/save`);
    return res.data;
  },

  deleteSave: async (id: number): Promise<DeletePostsSaveRes> => {
    const res = await AxiosInstance.delete(`/api/posts/${id}/save`);
    return res.data;
  },

  getMeSaved: async (params: GetMeSavedParamsReq): Promise<GetMeSavedRes> => {
    const res = await AxiosInstance.get('/api/me/saved', { params });
    return res.data;
  },
};

export default apiSaves;
