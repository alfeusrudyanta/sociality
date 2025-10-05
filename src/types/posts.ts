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

type PostPostsReq = {
  image: File;
  caption: string;
};

type PostPostsRes = ApiResponse & {
  data: Post;
};

type GetPostsRes = PostPostsRes;

type DeletePostsRes = ApiResponse & {
  data: {
    deleted: boolean;
  };
};

export type { PostPostsReq, PostPostsRes, GetPostsRes, DeletePostsRes };
