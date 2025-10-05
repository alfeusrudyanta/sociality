import { useMutation, useQueryClient } from '@tanstack/react-query';

import apiAuth from '@/services/queries/auth';
import { PostRegisterReq, PostLoginReq } from '@/types/auth';

const useAuth = () => {
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: (data: PostRegisterReq) => apiAuth.postRegister(data),
    onSuccess: (data) => {
      if (data.data.token) {
        document.cookie = `token=${data.data.token}; max-age=${
          7 * 24 * 60 * 60
        }; path=/`;
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const loginMutation = useMutation({
    mutationFn: (data: PostLoginReq) => apiAuth.postLogin(data),
    onSuccess: (data) => {
      if (data.data.token) {
        document.cookie = `token=${data.data.token}; max-age=${
          7 * 24 * 60 * 60
        }; path=/`;
      }
      queryClient.invalidateQueries({ queryKey: ['profile'] });
    },
  });

  const logout = () => {
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    queryClient.removeQueries({ queryKey: ['profile'] });
    loginMutation.reset();
  };

  return {
    registerMutation,
    loginMutation,
    logout,
  };
};

export default useAuth;
