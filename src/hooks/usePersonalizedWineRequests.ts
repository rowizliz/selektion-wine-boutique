import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface PersonalizedWineRequest {
  id: string;
  tracking_token: string;
  created_at: string;
  updated_at: string;
  customer_name: string;
  phone: string;
  wine_types: string[] | null;
  wine_styles: string[] | null;
  cuisine_types: string[] | null;
  taste_sweet_level: number | null;
  taste_spicy_level: number | null;
  music_genres: string[] | null;
  hobbies: string[] | null;
  budget_range: string | null;
  occasions: string[] | null;
  additional_notes: string | null;
  status: string;
  recommendation_message: string | null;
  recommendation_published_at: string | null;
}

export interface PersonalizedWineFormData {
  customer_name: string;
  phone: string;
  wine_types?: string[];
  wine_styles?: string[];
  cuisine_types?: string[];
  taste_sweet_level?: number;
  taste_spicy_level?: number;
  music_genres?: string[];
  hobbies?: string[];
  budget_range?: string;
  occasions?: string[];
  additional_notes?: string;
}

export const usePersonalizedWineRequests = () => {
  return useQuery({
    queryKey: ["personalized-wine-requests"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("personalized_wine_requests")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as PersonalizedWineRequest[];
    },
  });
};

export const useCreatePersonalizedWineRequest = () => {
  return useMutation({
    mutationFn: async (formData: PersonalizedWineFormData) => {
      const { error } = await supabase
        .from("personalized_wine_requests")
        .insert(formData);

      if (error) throw error;
      return { success: true };
    },
  });
};

export const useUpdatePersonalizedWineStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from("personalized_wine_requests")
        .update({ status })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalized-wine-requests"] });
    },
  });
};

export const useDeletePersonalizedWineRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("personalized_wine_requests")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["personalized-wine-requests"] });
    },
  });
};
