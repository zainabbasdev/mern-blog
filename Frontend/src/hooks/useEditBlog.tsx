import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { FieldValues } from "react-hook-form";

const useEditBlog = (endpoint: string) => {
  const apiClient = new APIClient(endpoint);

  return useMutation({
    mutationFn: (data: FieldValues) => apiClient.putRequest(data),
  });
};

export default useEditBlog;
