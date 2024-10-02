"use client";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetArchivedUsers = () => {
  const query = useQuery({
    queryKey: ["archivedAccounts"],
    queryFn: async () => {
      const response = await client.api.users["archived"].$get();

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
