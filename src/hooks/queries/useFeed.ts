import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

import apiFeed from '@/services/queries/feed';
import type { GetFeedParamsReq, GetFeedRes } from '@/types/feed';

const useFeed = () => {
  const feedQuery = useInfiniteQuery<GetFeedRes, Error>({
    queryKey: ['feed'],
    queryFn: ({ pageParam = 1 }) => {
      const params: GetFeedParamsReq = { page: pageParam as number, limit: 10 };
      return apiFeed.getFeed(params);
    },
    getNextPageParam: (lastPage) => {
      const { page, totalPages } = lastPage.data.pagination;
      return page < totalPages ? page + 1 : undefined;
    },
    initialPageParam: 1,
  });

  const allPosts = useMemo(() => {
    return feedQuery.data?.pages.flatMap((page) => page.data.items) ?? [];
  }, [feedQuery.data]);

  return {
    feedQuery,
    allPosts,
  };
};

export default useFeed;
