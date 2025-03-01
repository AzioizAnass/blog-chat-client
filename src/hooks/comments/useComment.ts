import { useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../../utils/api.ts';
import type { CommentRequest, CommentResponse } from '../../types/comment.d.ts';

const addComment = async (comment: CommentRequest): Promise<CommentResponse> => {
  const response = await api.post<CommentResponse>('/api/comments', comment);
  return response.data;
};

export const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: addComment,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['comments'] });
    },
  });
};
