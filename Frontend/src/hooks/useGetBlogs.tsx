import { UseQueryResult, useQuery } from "@tanstack/react-query";

import APIClient from "../services/apiClient";
import { Blog } from "../types";

const useGetBlogs = (endpoint: string): UseQueryResult<Blog[], Error> => {
  const apiClient = new APIClient(endpoint);

  return useQuery({
    queryKey: [endpoint],
    queryFn: async () => {
      const response = await apiClient.getRequest();
      return response.data;
    },
  });
};

export default useGetBlogs;

//   params: {
//     genres: gameQuery.genreId,
//     parent_platforms: gameQuery.platformId,
//     ordering: gameQuery.sortOrder,
//     search: gameQuery.searchText,
//     page: pageParam,
//   },
