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

type User = {
  id: number;
  username: string;
  name: string;
  avatarUrl: null | string;
  isFollowedByMe: boolean;
  isMe: boolean;
  followsMe: boolean;
};

type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

type LikedPost = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
  likedAt: string;
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
  author: Author;
};

type PostLikeRes = ApiResponse & {
  data: {
    liked: boolean;
    likeCount: number;
  };
};

type DeleteLikeRes = PostLikeRes;

type GetLikesParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetLikesRes = {
  data: {
    users: User[];
    pagination: Pagination;
  };
};

type GetMeLikesParamsReq = GetLikesParamsReq;

/* Infinite Query */
type GetMeLikesRes = {
  data: {
    posts: LikedPost[];
    pagination: Pagination;
  };
};

export type {
  PostLikeRes,
  DeleteLikeRes,
  GetLikesParamsReq,
  GetLikesRes,
  GetMeLikesParamsReq,
  GetMeLikesRes,
};
