import { UseQueryResult, useQuery } from "@tanstack/react-query";

import APIClient from "../services/apiClient";
import { Blog } from "../types";

const useGetBlog = (id: string): UseQueryResult<Blog, Error> => {
  const apiClient = new APIClient("/blogs/" + id);

  return useQuery({
    queryKey: ["blog"],
    queryFn: async () => {
      const response = await apiClient.getRequest();
      return response.data;
    },
  });
};

export default useGetBlog;
