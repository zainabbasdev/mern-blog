import { useMutation } from "@tanstack/react-query";
import APIClient from "../services/apiClient";
import { FieldValues } from "react-hook-form";

const apiClient = new APIClient("/blogs/");

const useCreateBlog = () => {
  return useMutation({
    mutationFn: (data: FieldValues) => apiClient.postRequest(data),
  });
};

export default useCreateBlog;
