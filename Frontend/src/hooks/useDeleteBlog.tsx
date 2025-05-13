import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const useDeleteBlog = (endpoint: string) => {
  const apiClient = new APIClient(endpoint);

  return useMutation({
    mutationFn: () => apiClient.deleteRequest(),
  });
};

export default useDeleteBlog;
