import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface CollaboratorApplication {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  date_of_birth: string | null;
  occupation: string | null;
  experience: string | null;
  motivation: string | null;
  cv_url: string | null;
  status: 'pending' | 'reviewing' | 'approved' | 'rejected';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateApplicationData {
  full_name: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  occupation?: string;
  experience?: string;
  motivation?: string;
  cv_url?: string;
}

// Fetch all applications (admin only)
export const useApplications = () => {
  return useQuery({
    queryKey: ['collaborator-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('collaborator_applications')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as CollaboratorApplication[];
    }
  });
};

// Create new application (public)
export const useCreateApplication = () => {
  return useMutation({
    mutationFn: async (applicationData: CreateApplicationData) => {
      const { data, error } = await supabase
        .from('collaborator_applications')
        .insert(applicationData)
        .select()
        .single();

      if (error) throw error;
      return data;
    }
  });
};

// Update application (admin only)
export const useUpdateApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<CollaboratorApplication> & { id: string }) => {
      const { data, error } = await supabase
        .from('collaborator_applications')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-applications'] });
      queryClient.invalidateQueries({ queryKey: ['pending-request-counts'] });
    }
  });
};

// Delete application (admin only)
export const useDeleteApplication = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('collaborator_applications')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['collaborator-applications'] });
      queryClient.invalidateQueries({ queryKey: ['pending-request-counts'] });
    }
  });
};

// Upload CV file
export const uploadCV = async (file: File): Promise<string> => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `cvs/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('recruitment-files')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  // Return the path (admin will use signed URL to access)
  return filePath;
};

// Get signed URL for CV download (admin only)
export const getCVSignedUrl = async (path: string): Promise<string> => {
  const { data, error } = await supabase.storage
    .from('recruitment-files')
    .createSignedUrl(path, 3600); // 1 hour expiry

  if (error) throw error;
  return data.signedUrl;
};
