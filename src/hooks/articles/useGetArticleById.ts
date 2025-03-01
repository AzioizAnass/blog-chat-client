import { useQuery } from '@tanstack/react-query';
import api from '../../utils/api.ts';
import type { Article } from '../../types/article.d.ts';

const getArticleById = async (id: number): Promise<Article> => {
  const response = await api.get<Article>(`/api/articles/${id}`);
  return response.data;
};

export const useArticle = (id: number) => {
  return useQuery({
    queryKey: ['article', id],
    queryFn: () => getArticleById(id),
    enabled: !!id,
  });
};
