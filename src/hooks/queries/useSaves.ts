import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import apiSaves from '@/services/queries/saves';
import type {
  GetMeSavedParamsReq,
  GetMeSavedRes,
  PostPostsSaveRes,
  DeletePostsSaveRes,
} from '@/types/saves';

const useSaves = (postId?: number) => {
  const queryClient = useQueryClient();

  const meSavedQuery = useInfiniteQuery<GetMeSavedRes, Error>({
    queryKey: ['meSaved'],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetMeSavedParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiSaves.getMeSaved(params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const saveMutation = useMutation<PostPostsSaveRes>({
    mutationFn: () => {
      if (!postId) throw new Error('postId is required to save a post');
      return apiSaves.postSave(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meSaved'] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });

  const unsaveMutation = useMutation<DeletePostsSaveRes>({
    mutationFn: () => {
      if (!postId) throw new Error('postId is required to unsave a post');
      return apiSaves.deleteSave(postId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['meSaved'] });
      if (postId)
        queryClient.invalidateQueries({ queryKey: ['posts', postId] });
    },
  });

  const savedPosts =
    meSavedQuery.data?.pages.flatMap((p) => p.data.posts) ?? [];

  return {
    meSavedQuery,
    savedPosts,
    saveMutation,
    unsaveMutation,
  };
};

export default useSaves;
