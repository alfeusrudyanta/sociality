import type { GetMeRes, PatchMeReq, PatchMeRes } from '@/types/me';

import AxiosInstance from '../api/axios';

const apiMe = {
  getMe: async (): Promise<GetMeRes> => {
    const res = await AxiosInstance.get('/api/me');
    return res.data;
  },

  patchMe: async (data: PatchMeReq): Promise<PatchMeRes> => {
    let body: FormData | PatchMeReq;
    const headers: Record<string, string> = {};

    if ('avatar' in data && data.avatar instanceof File) {
      body = new FormData();
      body.append('name', data.name);
      body.append('username', data.username);
      body.append('phone', data.phone);
      body.append('bio', data.bio);
      body.append('avatar', data.avatar);
      headers['Content-Type'] = 'multipart/form-data';
    } else {
      body = data;
    }

    const res = await AxiosInstance.patch<PatchMeRes>('/api/me', body, {
      headers,
    });

    return res.data;
  },
};

export default apiMe;
