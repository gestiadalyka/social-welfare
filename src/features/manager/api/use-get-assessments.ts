"use client";
import { useQuery } from "@tanstack/react-query";

import { client } from "@/lib/hono";

export const useGetAssessments = () => {
  const query = useQuery({
    queryKey: ["assessments"],
    queryFn: async () => {
      const response = await client.api.assessments.$get();

      if (!response.ok) {
        throw new Error("Failed to fetch accounts");
      }

      const { data } = await response.json();
      return data;
    },
  });

  return query;
};
