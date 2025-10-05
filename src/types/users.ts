type ApiResponse = {
  success: boolean;
  message: string;
};

type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  author: Author;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

type Pagination = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

type UserSearch = {
  id: number;
  username: string;
  name: string;
  avatarUrl: null | string;
  isFollowedByMe: boolean;
};

type UserCounts = {
  post: number;
  followers: number;
  following: number;
  likes: number;
};

type GetUsersLikesParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetUsersLikesRes = ApiResponse & {
  data: {
    posts: Post[];
    pagination: Pagination;
  };
};

type GetUsersPostsParamsReq = GetUsersLikesParamsReq;

/* Infinite Query */
type GetUsersPostsRes = GetUsersLikesRes;

type GetUsersSearchParamsReq = GetUsersLikesParamsReq & {
  q: string;
};

/* Infinite Query */
type GetUsersSearchRes = ApiResponse & {
  data: {
    users: UserSearch[];
    pagination: Pagination;
  };
};

type GetUsersRes = ApiResponse & {
  data: {
    id: number;
    name: string;
    username: string;
    bio: string;
    avatarUrl: string | null;
    email: string;
    phone: string;
    counts: UserCounts;
    isFollowing: boolean;
    isMe: boolean;
  };
};

export type {
  GetUsersLikesParamsReq,
  GetUsersLikesRes,
  GetUsersPostsParamsReq,
  GetUsersPostsRes,
  GetUsersSearchParamsReq,
  GetUsersSearchRes,
  GetUsersRes,
  UserSearch,
};
