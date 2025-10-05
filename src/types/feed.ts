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

type GetFeedParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetFeedRes = ApiResponse & {
  data: {
    items: Post[];
    pagination: Pagination;
  };
};

export type { GetFeedParamsReq, GetFeedRes, Post };
