import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface WineRecommendationInput {
  wine_id: string;
  wine_name: string;
  wine_price: string;
  wine_image_url: string | null;
  recommendation_reason: string | null;
  display_order: number;
}

interface SaveRecommendationsParams {
  requestId: string;
  trackingToken: string;
  message: string;
  wines: WineRecommendationInput[];
}

export const useSaveWineRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, message, wines }: SaveRecommendationsParams) => {
      // Delete existing recommendations for this request
      const { error: deleteError } = await supabase
        .from("wine_recommendations")
        .delete()
        .eq("request_id", requestId);

      if (deleteError) throw deleteError;

      // Insert new recommendations
      if (wines.length > 0) {
        const { error: insertError } = await supabase
          .from("wine_recommendations")
          .insert(
            wines.map((wine) => ({
              request_id: requestId,
              ...wine,
            }))
          );

        if (insertError) throw insertError;
      }

      // Update request with message and publish timestamp
      const { error: updateError } = await supabase
        .from("personalized_wine_requests")
        .update({
          recommendation_message: message,
          recommendation_published_at: new Date().toISOString(),
          status: "completed",
        })
        .eq("id", requestId);

      if (updateError) throw updateError;

      return { success: true };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalized-wine-requests"] });
    },
  });
};
