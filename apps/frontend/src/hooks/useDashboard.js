import { useMutation, useQuery } from "@tanstack/react-query";

import { apiClient } from "@/lib/apiClient";

// GET DASHBOARD
export const useDashboard = () =>
  useQuery({
    queryKey: ["dashboard"],

    queryFn: async () =>
      apiClient("/dashboard", {
        method: "GET",
      }),

    staleTime: 1000 * 60,

    retry: false,

    refetchOnWindowFocus: false,
  });

// REFRESH DASHBOARD
export const useRefreshDashboard = () =>
  useMutation({
    mutationFn: async () =>
      apiClient("/dashboard", {
        method: "GET",
      }),
  });
