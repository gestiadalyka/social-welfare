import { InferRequestType, InferResponseType } from "hono";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { client } from "@/lib/hono";
import { toast } from "sonner";

// Define the types based on the API client
type ResponseType = InferResponseType<typeof client.api.assessments.$post>;
type RequestType = InferRequestType<
  typeof client.api.assessments.$post
>["json"];

export const useCreateAssessment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation<ResponseType, Error, RequestType>({
    mutationFn: async (json) => {
      try {
        // Make the POST request to create assessments
        const response = await client.api.assessments.$post({ json });

        // Check if the response is not OK
        if (!response.ok) {
          // Try to parse the response as JSON to extract error message
          const errorText = await response.text();

          // Try to parse the errorText as JSON
          let errorMessage = "Failed to create assessment";
          try {
            const errorData = JSON.parse(errorText);
            errorMessage = errorData?.error || errorMessage;
          } catch (parseError) {
            // If parsing fails, use the original errorText
            errorMessage = errorText;
          }

          throw new Error(errorMessage);
        }

        // Parse and return the JSON response
        const data = await response.json();
        return data;
      } catch (error) {
        console.error("Create Assessment Error:", error);
        throw error; // Rethrow error to trigger onError
      }
    },
    onSuccess: () => {
      toast.success("Assessment saved successfully");
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
    },
    onError: (error) => {
      toast.error(`${error.message}`);
    },
  });

  return mutation;
};
