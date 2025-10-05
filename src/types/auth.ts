type ApiResponse = {
  success: boolean;
  message: string;
};

type User = {
  id: number;
  name: string;
  username: string;
  email: string;
  phone: string;
  avatarUrl: null | string;
};

type PostRegisterReq = {
  name: string;
  username: string;
  email: string;
  phone: string;
  password: string;
};

type PostRegisterRes = ApiResponse & {
  data: {
    token: string;
    user: User;
  };
};

type PostLoginReq = {
  email: string;
  password: string;
};

type PostLoginRes = ApiResponse & {
  data: {
    token: string;
  };
};

export type { PostRegisterReq, PostRegisterRes, PostLoginReq, PostLoginRes };
