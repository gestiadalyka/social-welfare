import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

type ResponseType = InferResponseType<
  (typeof client.api.users)[":id"]["$post"]
>;

export const useUnarchiveAccount = (id?: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error>({
    mutationFn: async () => {
      const response = await client.api.users["unarchive"][":id"]["$post"]({
        param: { id },
      });
      return await response.json();
    },
    onSuccess: () => {
      toast.success("Account archived");
      queryClient.invalidateQueries({ queryKey: ["account", { id }] });
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["archivedAccounts"] });
      // TODO: Invalidate summary and transactions
    },
    onError: () => {
      toast.error("Failed to archive account");
    },
  });

  return mutation;
};
