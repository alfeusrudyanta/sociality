import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import apiComments from '@/services/queries/comments';
import type {
  GetCommentsParamsReq,
  GetCommentsRes,
  PostCommentsReq,
} from '@/types/comments';

const useComments = (postId?: number) => {
  const queryClient = useQueryClient();

  const commentsQuery = useInfiniteQuery<GetCommentsRes, Error>({
    queryKey: ['comments', postId],
    queryFn: ({ pageParam = 1 }) => {
      if (!postId) throw new Error('postId is required to fetch comments');
      const params: GetCommentsParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiComments.getComments(postId, params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
    enabled: !!postId,
  });

  const postCommentMutation = useMutation({
    mutationFn: (data: PostCommentsReq) => {
      if (!postId) throw new Error('postId is required to post a comment');
      return apiComments.postComments(postId, data);
    },
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
    },
  });

  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => apiComments.deleteComments(commentId),
    onSuccess: () => {
      if (postId) {
        queryClient.invalidateQueries({ queryKey: ['comments', postId] });
      }
    },
  });

  const comments =
    commentsQuery.data?.pages.flatMap((p) => p.data.comments) ?? [];

  return {
    commentsQuery,
    postCommentMutation,
    deleteCommentMutation,
    comments,
  };
};

export default useComments;
