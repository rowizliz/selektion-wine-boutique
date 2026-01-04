import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface OrderItem {
  id: string;
  order_id: string;
  wine_id: string | null;
  wine_name: string;
  quantity: number;
  unit_price: number;
  purchase_price: number;
  created_at: string;
}

export interface Order {
  id: string;
  customer_name: string;
  customer_phone: string | null;
  order_type: "sale" | "gift";
  status: "pending" | "confirmed" | "completed" | "cancelled";
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export function useOrders() {
  return useQuery({
    queryKey: ["orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("orders")
        .select(`
          *,
          order_items(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Order[];
    },
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (order: {
      customer_name: string;
      customer_phone?: string;
      order_type: "sale" | "gift";
      notes?: string;
      items: {
        wine_id: string;
        wine_name: string;
        quantity: number;
        unit_price: number;
        purchase_price: number;
      }[];
    }) => {
      // Create order
      const { data: orderData, error: orderError } = await supabase
        .from("orders")
        .insert({
          customer_name: order.customer_name,
          customer_phone: order.customer_phone,
          order_type: order.order_type,
          notes: order.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const orderItems = order.items.map((item) => ({
        order_id: orderData.id,
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        purchase_price: item.purchase_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(orderItems);

      if (itemsError) throw itemsError;

      // Update inventory (decrease stock)
      for (const item of order.items) {
        const { data: inv } = await supabase
          .from("inventory")
          .select("quantity_in_stock")
          .eq("wine_id", item.wine_id)
          .maybeSingle();

        if (inv) {
          await supabase
            .from("inventory")
            .update({ quantity_in_stock: inv.quantity_in_stock - item.quantity })
            .eq("wine_id", item.wine_id);
        }
      }

      return orderData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Đã tạo đơn hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      orderId,
      status,
    }: {
      orderId: string;
      status: Order["status"];
    }) => {
      const { data, error } = await supabase
        .from("orders")
        .update({ status })
        .eq("id", orderId)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đã cập nhật trạng thái");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

export function useDeleteOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (orderId: string) => {
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Đã xóa đơn hàng");
    },
    onError: (error) => {
      toast.error("Lỗi: " + error.message);
    },
  });
}

// Calculate financials
export function calculateOrderFinancials(orders: Order[]) {
  let totalRevenue = 0;
  let totalCost = 0;
  let salesCount = 0;
  let giftCount = 0;

  orders.forEach((order) => {
    if (order.status === "cancelled") return;

    if (order.order_type === "sale") {
      salesCount++;
    } else {
      giftCount++;
    }

    order.order_items?.forEach((item) => {
      totalRevenue += item.unit_price * item.quantity;
      totalCost += item.purchase_price * item.quantity;
    });
  });

  return {
    totalRevenue,
    totalCost,
    profit: totalRevenue - totalCost,
    salesCount,
    giftCount,
    totalOrders: salesCount + giftCount,
  };
}
