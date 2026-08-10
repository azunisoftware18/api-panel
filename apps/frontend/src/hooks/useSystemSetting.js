"use client";

import {
  useMutation,
  useQuery,
  keepPreviousData,
  useQueryClient,
} from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";

/* GET ALL */

export const useGetAllSystemSettings = ({
  page = 1,
  limit = 10,
  search = "",
}) =>
  useQuery({
    queryKey: ["system-settings", page, limit, search],
    queryFn: () =>
      apiClient(
        `/system-settings?page=${page}&limit=${limit}&search=${search}`,
      ),
    placeholderData: keepPreviousData,
  });

/* GET ONE */

export const useGetOneSystemSetting = () =>
  useMutation({
    mutationFn: (id) =>
      apiClient(`/system-settings/${id}`, {
        method: "GET",
      }),
  });

/* CREATE */

export const useCreateSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload) => {
      const isFormData = payload instanceof FormData;

      return apiClient("/system-settings", {
        method: "POST",
        headers: isFormData
          ? {}
          : {
              "Content-Type": "application/json",
            },
        body: isFormData ? payload : JSON.stringify(payload),
      });
    },

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["system-settings"],
      }),
  });
};

/* UPDATE */

export const useUpdateSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }) => {
      const isFormData = payload instanceof FormData;

      return apiClient(`/system-settings/${id}`, {
        method: "PATCH",
        headers: isFormData
          ? {}
          : {
              "Content-Type": "application/json",
            },
        body: isFormData ? payload : JSON.stringify(payload),
      });
    },

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["system-settings"],
      }),
  });
};

/* DELETE */

export const useDeleteSystemSetting = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      apiClient(`/system-settings/${id}`, {
        method: "DELETE",
      }),

    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["system-settings"],
      }),
  });
};
