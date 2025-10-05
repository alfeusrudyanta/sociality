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

type Author = {
  id: number;
  username: string;
  name: string;
  avatarUrl: string | null;
};

type Comments = {
  id: number;
  text: string;
  createdAt: string;
  author: Author;
};

type GetCommentsParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetCommentsRes = ApiResponse & {
  data: {
    comments: Comments[];
    pagination: Pagination;
  };
};

type PostCommentsReq = {
  text: string;
};

type PostCommentsRes = ApiResponse & {
  data: {
    id: number;
    text: string;
    createdAt: string;
    author: Author;
    isMine: boolean;
  };
};

type DeleteCommentsRes = ApiResponse & {
  data: {
    deleted: boolean;
  };
};

export type {
  GetCommentsParamsReq,
  GetCommentsRes,
  PostCommentsReq,
  PostCommentsRes,
  DeleteCommentsRes,
  Comments,
};
