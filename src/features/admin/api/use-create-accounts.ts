import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// Define the types based on the API client
type ResponseType = InferResponseType<typeof client.api.users.$post>;
type RequestType = InferRequestType<typeof client.api.users.$post>["json"];

export const useCreateAccounts = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      try {
        // Make the POST request to create accounts
        const response = await client.api.users.$post({ json });

        // Check if the response is not OK
        if (!response.ok) {
          // Extract the error message from the response
          const errorText = await response.text();
          throw new Error(errorText || "Failed to create accounts");
        }

        // Parse and return the JSON response
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Create Accounts Error:", error);
        throw error; // Rethrow error to trigger onError
      }
    },
    onSuccess: () => {
      toast.success("Accounts created successfully");
      queryClient.invalidateQueries({ queryKey: ["accounts"] });
    },
    onError: (error) => {
      toast.error(`Failed to create accounts: ${error.message}`);
    },
  });

  return mutation;
};
