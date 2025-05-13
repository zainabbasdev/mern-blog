import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";

const useRatings = (endpoint: string) => {
  const apiClient = new APIClient(endpoint);

  return useMutation({
    mutationFn: (data: number) => apiClient.postRequest({ rating: data }),
  });
};

export default useRatings;
