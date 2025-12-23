import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface BirthdayGiftRequest {
  id: string;
  created_at: string;
  updated_at: string;
  sender_name: string;
  sender_phone: string;
  recipient_name: string;
  recipient_birthday: string | null;
  recipient_gender: string | null;
  relationship: string | null;
  wine_types: string[] | null;
  wine_style: string | null;
  cuisine_types: string[] | null;
  taste_preferences: string[] | null;
  food_allergies: string | null;
  music_genres: string[] | null;
  hobbies: string[] | null;
  favorite_colors: string[] | null;
  style_preferences: string[] | null;
  birthday_message: string | null;
  budget: string | null;
  additional_notes: string | null;
  status: string;
}

export const useBirthdayGiftRequests = () => {
  return useQuery({
    queryKey: ['birthday-gift-requests'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('birthday_gift_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BirthdayGiftRequest[];
    }
  });
};

export const useUpdateRequestStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('birthday_gift_requests')
        .update({ status })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthday-gift-requests'] });
    }
  });
};

export const useDeleteBirthdayGiftRequest = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('birthday_gift_requests')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['birthday-gift-requests'] });
    }
  });
};
