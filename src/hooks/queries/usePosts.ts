import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import apiPosts from '@/services/queries/posts';
import type {
  PostPostsReq,
  PostPostsRes,
  GetPostsRes,
  DeletePostsRes,
} from '@/types/posts';

const usePosts = (postId?: number) => {
  const queryClient = useQueryClient();

  const postQuery = useQuery<GetPostsRes, Error>({
    queryKey: ['posts', postId],
    queryFn: () => {
      if (!postId) throw new Error('Post ID is required');
      return apiPosts.getPosts(postId);
    },
    staleTime: 0,
    enabled: !!postId,
  });

  const createPostMutation = useMutation<PostPostsRes, Error, PostPostsReq>({
    mutationFn: (data: PostPostsReq) => apiPosts.postPosts(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const deletePostMutation = useMutation<DeletePostsRes, Error, number>({
    mutationFn: (id: number) => apiPosts.deletePosts(id),
    onSuccess: (_, id) => {
      queryClient.removeQueries({ queryKey: ['feed'] });
      queryClient.removeQueries({ queryKey: ['user'] });
      queryClient.removeQueries({ queryKey: ['posts', id] });
      queryClient.removeQueries({ queryKey: ['likes', id] });
      queryClient.removeQueries({ queryKey: ['comments', id] });
    },
  });

  return {
    postQuery,
    createPostMutation,
    deletePostMutation,
  };
};

export default usePosts;
