import api from '../../utils/api.ts';
import { useMutation, useQuery } from '@tanstack/react-query';
import type { LoginRequest, SignUpRequest } from '../../types/auth.d.ts';

export const useLogin = () => {
  return useMutation<any, Error, LoginRequest>({
    mutationFn: async (formData: LoginRequest) => {
      const response = await api.post("api/auth/signin", formData);
      return response.data;
    }
  });
};

export const useUserInfo = (token: string| null) => {
  return useQuery({
    queryKey: ["userInfo", token],
    queryFn: async () => {
      const response = await api.get("/api/auth/info", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    },
    enabled: !!token,
  });
};

export const useSignUp = () => {
  return useMutation<any, Error, SignUpRequest>({
    mutationFn: async (formData: SignUpRequest) => {
      const response = await api.post("api/auth/signup", formData);
      return response.data;
    }
  });
};
