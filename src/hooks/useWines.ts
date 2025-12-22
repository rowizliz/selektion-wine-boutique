import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface WineDB {
  id: string;
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  story: string | null;
  image_url: string | null;
  category: "red" | "white" | "sparkling";
  temperature: string | null;
  alcohol: string | null;
  pairing: string | null;
  tasting_notes: string | null;
  flavor_notes: string[] | null;
  vintage: string | null;
  region: string | null;
  sweetness: number | null;
  body: number | null;
  tannin: number | null;
  acidity: number | null;
  fizzy: number | null;
  created_at: string;
  updated_at: string;
}

export interface WineInput {
  name: string;
  origin: string;
  grapes: string;
  price: string;
  description: string;
  story?: string;
  image_url?: string;
  category: "red" | "white" | "sparkling";
  temperature?: string;
  alcohol?: string;
  pairing?: string;
  tasting_notes?: string;
  flavor_notes?: string[];
  vintage?: string;
  region?: string;
  sweetness?: number;
  body?: number;
  tannin?: number;
  acidity?: number;
  fizzy?: number;
}

export const useWines = () => {
  return useQuery({
    queryKey: ["wines"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wines")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as WineDB[];
    },
  });
};

export const useWine = (id: string) => {
  return useQuery({
    queryKey: ["wines", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("wines")
        .select("*")
        .eq("id", id)
        .maybeSingle();

      if (error) throw error;
      return data as WineDB | null;
    },
    enabled: !!id,
  });
};

export const useCreateWine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (wine: WineInput) => {
      const { data, error } = await supabase
        .from("wines")
        .insert(wine)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({
        title: "Thành công",
        description: "Đã thêm rượu mới",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useUpdateWine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, ...wine }: WineInput & { id: string }) => {
      const { data, error } = await supabase
        .from("wines")
        .update(wine)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({
        title: "Thành công",
        description: "Đã cập nhật rượu",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const useDeleteWine = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("wines").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wines"] });
      toast({
        title: "Thành công",
        description: "Đã xóa rượu",
      });
    },
    onError: (error) => {
      toast({
        title: "Lỗi",
        description: error.message,
        variant: "destructive",
      });
    },
  });
};

export const uploadWineImage = async (file: File): Promise<string> => {
  const fileExt = file.name.split(".").pop();
  const fileName = `${crypto.randomUUID()}.${fileExt}`;
  const filePath = `${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from("wine-images")
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data } = supabase.storage.from("wine-images").getPublicUrl(filePath);
  return data.publicUrl;
};
