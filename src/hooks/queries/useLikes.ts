import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import apiLikes from '@/services/queries/likes';
import type {
  GetLikesParamsReq,
  GetLikesRes,
  GetMeLikesParamsReq,
  GetMeLikesRes,
  PostLikeRes,
  DeleteLikeRes,
} from '@/types/likes';

const useLikes = (postId?: number) => {
  const queryClient = useQueryClient();

  const likesQuery = useInfiniteQuery<GetLikesRes, Error>({
    queryKey: ['likes', postId],
    queryFn: ({ pageParam = 1 }) => {
      if (!postId) throw new Error('postId is required');
      const params: GetLikesParamsReq = {
        page: pageParam as number,
        limit: 5,
      };
      return apiLikes.getLikes(postId, params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });

  const meLikesQuery = useInfiniteQuery<GetMeLikesRes, Error>({
    queryKey: ['meLikes'],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetMeLikesParamsReq = {
        page: pageParam as number,
        limit: 5,
      };
      return apiLikes.getMeLikes(params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const likeMutation = useMutation<PostLikeRes, Error, number>({
    mutationFn: (id) => apiLikes.postLike(id),
    onSuccess: (_, id) => {
      if (postId) queryClient.invalidateQueries({ queryKey: ['likes', id] });
      queryClient.invalidateQueries({ queryKey: ['meLikes'] });
    },
  });

  const unlikeMutation = useMutation<DeleteLikeRes, Error, number>({
    mutationFn: (id) => apiLikes.deleteLike(id),
    onSuccess: (_, id) => {
      if (postId) queryClient.invalidateQueries({ queryKey: ['likes', id] });
      queryClient.invalidateQueries({ queryKey: ['meLikes'] });
    },
  });

  const likedUsers = likesQuery.data?.pages.flatMap((p) => p.data.users) ?? [];
  const likedPosts =
    meLikesQuery.data?.pages.flatMap((p) => p.data.posts) ?? [];

  return {
    likesQuery,
    meLikesQuery,
    likedUsers,
    likedPosts,
    likeMutation,
    unlikeMutation,
  };
};

export default useLikes;
