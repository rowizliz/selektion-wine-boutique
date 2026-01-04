import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface InventoryItem {
  id: string;
  wine_id: string;
  quantity_in_stock: number;
  purchase_price: number;
  created_at: string;
  updated_at: string;
  wine?: {
    id: string;
    name: string;
    price: string;
    image_url: string | null;
    category: string;
  };
}

export function useInventory() {
  return useQuery({
    queryKey: ["inventory"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("inventory")
        .select(`
          *,
          wine:wines(id, name, price, image_url, category)
        `)
        .order("updated_at", { ascending: false });

      if (error) throw error;
      return data as InventoryItem[];
    },
  });
}

export function useUpsertInventory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (item: {
      wine_id: string;
      quantity_in_stock: number;
      purchase_price: number;
    }) => {
      const { data, error } = await supabase
        .from("inventory")
        .upsert(item, { onConflict: "wine_id" })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Đã cập nhật kho hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useUpdateStock() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      wine_id,
      quantity_change,
    }: {
      wine_id: string;
      quantity_change: number;
    }) => {
      // First get current stock
      const { data: current, error: fetchError } = await supabase
        .from("inventory")
        .select("quantity_in_stock")
        .eq("wine_id", wine_id)
        .maybeSingle();

      if (fetchError) throw fetchError;

      const newQuantity = (current?.quantity_in_stock ?? 0) + quantity_change;
      if (newQuantity < 0) throw new Error("Không đủ hàng trong kho");

      const { data, error } = await supabase
        .from("inventory")
        .update({ quantity_in_stock: newQuantity })
        .eq("wine_id", wine_id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}
