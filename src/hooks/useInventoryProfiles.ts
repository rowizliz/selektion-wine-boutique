import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InventoryProfile {
  id: string;
  name: string;
  description: string | null;
  start_date: string | null;
  end_date: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useInventoryProfiles() {
  return useQuery({
    queryKey: ["inventory-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InventoryProfile[];
    },
  });
}

export function useActiveProfile() {
  return useQuery({
    queryKey: ["inventory-profiles", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory_profiles")
        .select("*")
        .eq("is_active", true)
        .maybeSingle();

      if (error) throw error;
      return data as InventoryProfile | null;
    },
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profile: {
      name: string;
      description?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from("inventory_profiles")
        .insert(profile)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-profiles"] });
      toast.success("Đã tạo kỳ kho hàng mới");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useSetActiveProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (profileId: string) => {
      // First, deactivate all profiles
      await supabase
        .from("inventory_profiles")
        .update({ is_active: false })
        .neq("id", "00000000-0000-0000-0000-000000000000"); // Update all

      // Then activate the selected one
      const { data, error } = await supabase
        .from("inventory_profiles")
        .update({ is_active: true })
        .eq("id", profileId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-profiles"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đã chuyển kỳ kho hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      ...profile
    }: {
      id: string;
      name?: string;
      description?: string;
      start_date?: string;
      end_date?: string;
    }) => {
      const { data, error } = await supabase
        .from("inventory_profiles")
        .update(profile)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-profiles"] });
      toast.success("Đã cập nhật kỳ kho hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("inventory_profiles")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory-profiles"] });
      toast.success("Đã xóa kỳ kho hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}
