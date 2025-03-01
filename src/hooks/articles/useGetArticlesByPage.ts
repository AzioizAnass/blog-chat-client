import { useInfiniteQuery } from '@tanstack/react-query';
import api from '../../utils/api.ts';
import type { ArticlesResponse } from '../../types/article.d.ts';

const PAGE_SIZE = 6;

const getArticlesByPage = async ({ pageParam = 0 }): Promise<ArticlesResponse> => {
  const response = await api.get<ArticlesResponse>(
    `/api/articles/getByPage/${PAGE_SIZE}/${pageParam}`
  );
  return response.data;
};

export const useArticles = () => {
    return useInfiniteQuery({
      queryKey: ['articles'],
      queryFn: getArticlesByPage,
      initialPageParam: 0,
      getNextPageParam: (lastPage) => {
        return lastPage.last ? undefined : lastPage.number + 1;
      },
    });
  }