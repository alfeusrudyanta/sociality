type ApiResponse = {
  success: boolean;
  message: string;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type UserFollowers = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
  isFollowedByMe: boolean;
};

type PostFollowRes = ApiResponse & {
  data: {
    following: boolean;
  };
};

type DeleteFollowRes = PostFollowRes;

type GetUsersFollowersParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetUsersFollowersRes = ApiResponse & {
  data: {
    users: UserFollowers[];
    pagination: Pagination;
  };
};

type GetUsersFollowingParamsReq = GetUsersFollowersParamsReq;

/* Infinite Query */
type GetUsersFollowingRes = GetUsersFollowersRes;

type GetMeFollowersParamsReq = GetUsersFollowersParamsReq;

/* Infinite Query */
type GetMeFollowersRes = GetUsersFollowersRes;

type GetMeFollowingParamsReq = GetUsersFollowersParamsReq;

/* Infinite Query */
type GetMeFollowingRes = GetUsersFollowersRes;

export type {
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
};
