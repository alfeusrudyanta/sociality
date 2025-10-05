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

type Post = {
  id: number;
  imageUrl: string;
  caption: string;
  createdAt: string;
};

type PostPostsSaveRes = ApiResponse & {
  data: {
    saved: boolean;
  };
};

type DeletePostsSaveRes = PostPostsSaveRes;

type GetMeSavedParamsReq = {
  page: number;
  limit: number;
};

/* Infinite Query */
type GetMeSavedRes = ApiResponse & {
  data: {
    posts: Post[];
    pagination: Pagination;
  };
};

export type {
  PostPostsSaveRes,
  DeletePostsSaveRes,
  GetMeSavedParamsReq,
  GetMeSavedRes,
};
