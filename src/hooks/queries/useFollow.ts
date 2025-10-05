import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from '@tanstack/react-query';

import apiFollow from '@/services/queries/follow';
import type {
  GetUsersFollowersParamsReq,
  GetUsersFollowersRes,
  GetUsersFollowingParamsReq,
  GetUsersFollowingRes,
  GetMeFollowersParamsReq,
  GetMeFollowersRes,
  GetMeFollowingParamsReq,
  GetMeFollowingRes,
} from '@/types/follow';

const useFollow = (username?: string) => {
  const queryClient = useQueryClient();

  const usersFollowersQuery = useInfiniteQuery<GetUsersFollowersRes, Error>({
    queryKey: ['usersFollowers', username],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetUsersFollowersParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiFollow.getUsersFollowers(username!, params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.page < lastPage.data.pagination.totalPages
        ? lastPage.data.pagination.page + 1
        : undefined,
    initialPageParam: 1,
    enabled: !!username,
  });

  const usersFollowingQuery = useInfiniteQuery<GetUsersFollowingRes, Error>({
    queryKey: ['usersFollowing', username],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetUsersFollowingParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiFollow.getUsersFollowing(username!, params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.page < lastPage.data.pagination.totalPages
        ? lastPage.data.pagination.page + 1
        : undefined,
    initialPageParam: 1,
    enabled: !!username,
  });

  const meFollowersQuery = useInfiniteQuery<GetMeFollowersRes, Error>({
    queryKey: ['meFollowers'],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetMeFollowersParamsReq = {
        page: pageParam as number,
        limit: 10,
      };
      return apiFollow.getMeFollowers(params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.page < lastPage.data.pagination.totalPages
        ? lastPage.data.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  });

  const meFollowingQuery = useInfiniteQuery<GetMeFollowingRes, Error>({
    queryKey: ['meFollowing'],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetMeFollowingParamsReq = {
        page: pageParam as number,
        limit: 50,
      };
      return apiFollow.getMeFollowing(params);
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.page < lastPage.data.pagination.totalPages
        ? lastPage.data.pagination.page + 1
        : undefined,
    initialPageParam: 1,
  });

  const followMutation = useMutation({
    mutationFn: (targetUsername: string) =>
      apiFollow.postFollow(targetUsername),
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({
        queryKey: ['usersFollowers', targetUsername],
      });
      queryClient.invalidateQueries({
        queryKey: ['usersFollowing', targetUsername],
      });
      queryClient.invalidateQueries({ queryKey: ['meFollowers'] });
      queryClient.invalidateQueries({ queryKey: ['meFollowing'] });
    },
  });

  const unfollowMutation = useMutation({
    mutationFn: (targetUsername: string) =>
      apiFollow.deleteFollow(targetUsername),
    onSuccess: (_, targetUsername) => {
      queryClient.invalidateQueries({
        queryKey: ['usersFollowers', targetUsername],
      });
      queryClient.invalidateQueries({
        queryKey: ['usersFollowing', targetUsername],
      });
      queryClient.invalidateQueries({ queryKey: ['meFollowers'] });
      queryClient.invalidateQueries({ queryKey: ['meFollowing'] });
    },
  });

  const usersFollowers =
    usersFollowersQuery.data?.pages.flatMap((p) => p.data.users) ?? [];
  const usersFollowing =
    usersFollowingQuery.data?.pages.flatMap((p) => p.data.users) ?? [];
  const meFollowers =
    meFollowersQuery.data?.pages.flatMap((p) => p.data.users) ?? [];
  const meFollowing =
    meFollowingQuery.data?.pages.flatMap((p) => p.data.users) ?? [];

  return {
    usersFollowersQuery,
    usersFollowingQuery,
    meFollowersQuery,
    meFollowingQuery,
    usersFollowers,
    usersFollowing,
    meFollowers,
    meFollowing,
    followMutation,
    unfollowMutation,
  };
};

export default useFollow;
