import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import apiMe from '@/services/queries/me';
import type { GetMeRes, PatchMeReq, PatchMeRes } from '@/types/me';

const useMe = () => {
  const queryClient = useQueryClient();

  const meQuery = useQuery<GetMeRes, Error>({
    queryKey: ['me'],
    queryFn: apiMe.getMe,
  });

  const patchMeMutation = useMutation<PatchMeRes, Error, PatchMeReq>({
    mutationFn: (data: PatchMeReq) => apiMe.patchMe(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['me'] });
      queryClient.removeQueries({ queryKey: ['user'] });
    },
  });

  return {
    meQuery,
    patchMeMutation,
  };
};

export default useMe;
