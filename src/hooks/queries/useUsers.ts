import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import apiUsers from '@/services/queries/users';
import type {
  GetUsersLikesParamsReq,
  GetUsersLikesRes,
  GetUsersPostsParamsReq,
  GetUsersPostsRes,
  GetUsersSearchParamsReq,
  GetUsersSearchRes,
  GetUsersRes,
} from '@/types/users';

const useUsers = (username?: string) => {
  const usersLikesQuery = useInfiniteQuery<GetUsersLikesRes, Error>({
    queryKey: ['usersLikes', username],
    queryFn: ({ pageParam = 1 }) => {
      if (!username) throw new Error('Username is required');
      const params: GetUsersLikesParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiUsers.getUsersLikes(username, params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username,
    initialPageParam: 1,
  });

  const usersPostsQuery = useInfiniteQuery<GetUsersPostsRes, Error>({
    queryKey: ['usersPosts', username],
    queryFn: ({ pageParam = 1 }) => {
      if (!username) throw new Error('Username is required');
      const params: GetUsersPostsParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiUsers.getUsersPosts(username, params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    enabled: !!username,
    initialPageParam: 1,
  });

  const usersSearchQuery = useInfiniteQuery<GetUsersSearchRes, Error>({
    queryKey: ['usersSearch', username],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetUsersSearchParamsReq = {
        page: pageParam as number,
        limit: 10,
        q: username || '',
      };
      return apiUsers.getUsersSearch(params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const userQuery = useQuery<GetUsersRes, Error>({
    queryKey: ['user', username],
    queryFn: () => {
      if (!username) throw new Error('Username is required');
      return apiUsers.getUsers(username);
    },
    enabled: !!username,
  });

  const usersLikes =
    usersLikesQuery.data?.pages.flatMap((p) => p.data.posts) ?? [];
  const usersPosts =
    usersPostsQuery.data?.pages.flatMap((p) => p.data.posts) ?? [];
  const usersSearch =
    usersSearchQuery.data?.pages.flatMap((p) => p.data.users) ?? [];
  const user = userQuery.data?.data ?? null;

  return {
    usersLikesQuery,
    usersPostsQuery,
    usersSearchQuery,
    userQuery,
    usersLikes,
    usersPosts,
    usersSearch,
    user,
  };
};

export default useUsers;
