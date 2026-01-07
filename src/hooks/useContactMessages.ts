import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

type ContactMessage = Tables<'contact_messages'>;

export const useContactMessages = () => {
  return useQuery({
    queryKey: ['contact-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as ContactMessage[];
    }
  });
};

export const useSubmitContactMessage = () => {
  return useMutation({
    mutationFn: async (data: { name: string; email: string; message: string }) => {
      const { error } = await supabase
        .from('contact_messages')
        .insert(data);

      if (error) throw error;
    }
  });
};

export const useUpdateContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, updates }: { id: string; updates: Partial<ContactMessage> }) => {
      const { error } = await supabase
        .from('contact_messages')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['pending-request-counts'] });
    }
  });
};

export const useDeleteContactMessage = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('contact_messages')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['pending-request-counts'] });
    }
  });
};
