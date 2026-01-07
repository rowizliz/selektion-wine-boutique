import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface GiftSetDB {
  id: string;
  name: string;
  price: number;
  items: string[];
  wine: string | null;
  image_url: string | null;
  category: string;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface GiftSetInput {
  name: string;
  price: number;
  items: string[];
  wine?: string | null;
  image_url?: string | null;
  category: string;
  is_active?: boolean;
  display_order?: number;
}

export const useGiftSets = () => {
  return useQuery({
    queryKey: ["gift_sets"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_sets")
        .select("*")
        .order("display_order", { ascending: true })
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as GiftSetDB[];
    },
  });
};

export const useActiveGiftSets = () => {
  return useQuery({
    queryKey: ["gift_sets", "active"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("gift_sets")
        .select("*")
        .eq("is_active", true)
        .order("display_order", { ascending: true });

      if (error) throw error;
      return data as GiftSetDB[];
    },
  });
};

export const useCreateGiftSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (giftSet: GiftSetInput) => {
      const { data, error } = await supabase
        .from("gift_sets")
        .insert([giftSet])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift_sets"] });
      toast({
        title: "Thành công",
        description: "Đã thêm set quà mới",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateGiftSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...giftSet }: GiftSetInput & { id: string }) => {
      const { data, error } = await supabase
        .from("gift_sets")
        .update(giftSet)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift_sets"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật set quà",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteGiftSet = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("gift_sets").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["gift_sets"] });
      toast({
        title: "Thành công",
        description: "Đã xóa set quà",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const uploadGiftImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
  const filePath = fileName;

  const { error: uploadError } = await supabase.storage
    .from("gift-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("gift-images").getPublicUrl(filePath);
  return data.publicUrl;
};
