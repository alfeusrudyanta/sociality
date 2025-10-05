import type { GetFeedParamsReq, GetFeedRes } from '@/types/feed';

import AxiosInstance from '../api/axios';

const apiFeed = {
  getFeed: async (params: GetFeedParamsReq): Promise<GetFeedRes> => {
    const res = await AxiosInstance.get('/api/feed', { params });
    return res.data;
  },
};

export default apiFeed;
