import { createProductReview } from "@/services/review.service";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useCreateNewProductReview = (
) => {
  const query = useQueryClient();
  const { mutate: createNewReview, isPending: isCreatingNewReview } =
    useMutation({
      mutationFn: createProductReview,

      onSuccess: () => {
        console.log("successe");
        // query.invalidateQueries({ queryKey: [QueryKey.GET_CONVERSATIONS] });
      },
    });
  return { createNewReview, isCreatingNewReview };
};
