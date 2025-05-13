import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const useComment = (endpoint: string) => {
  const apiClient = new APIClient(endpoint);

  return useMutation({
    mutationFn: (data: string) => apiClient.postRequest({ comment: data }),
  });
};

export default useComment;
