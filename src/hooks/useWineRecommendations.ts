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
  customerName: string;
  message: string;
  wines: WineRecommendationInput[];
}

// Generate URL-friendly slug from customer name
const generateSlug = (name: string): string => {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritics
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "") // Remove special chars
    .trim()
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Remove duplicate hyphens
};

export const useSaveWineRecommendations = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ requestId, customerName, message, wines }: SaveRecommendationsParams) => {
      // Generate slug from customer name
      const baseSlug = generateSlug(customerName);
      const slug = `${baseSlug}-${requestId.slice(0, 8)}`;

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

      // Update request with message, slug and publish timestamp
      const { error: updateError } = await supabase
        .from("personalized_wine_requests")
        .update({
          recommendation_message: message,
          recommendation_published_at: new Date().toISOString(),
          url_slug: slug,
          status: "completed",
        })
        .eq("id", requestId);

      if (updateError) throw updateError;

      return { success: true, slug };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalized-wine-requests"] });
    },
  });
};
