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
  discount: number;
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
      discount?: number;
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
          discount: order.discount ?? 0,
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

export function useUpdateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      orderId: string;
      customer_name: string;
      customer_phone?: string;
      order_type: "sale" | "gift";
      notes?: string;
      discount?: number;
      items: {
        id?: string;
        wine_id: string;
        wine_name: string;
        quantity: number;
        unit_price: number;
        purchase_price: number;
        original_quantity?: number;
      }[];
      originalItems: OrderItem[];
    }) => {
      // 1. Update order basic info
      const { error: orderError } = await supabase
        .from("orders")
        .update({
          customer_name: data.customer_name,
          customer_phone: data.customer_phone,
          order_type: data.order_type,
          notes: data.notes,
          discount: data.discount ?? 0,
        })
        .eq("id", data.orderId);

      if (orderError) throw orderError;

      // 2. Restore inventory for all original items
      for (const item of data.originalItems) {
        if (item.wine_id) {
          const { data: inv } = await supabase
            .from("inventory")
            .select("quantity_in_stock")
            .eq("wine_id", item.wine_id)
            .maybeSingle();

          if (inv) {
            await supabase
              .from("inventory")
              .update({ quantity_in_stock: inv.quantity_in_stock + item.quantity })
              .eq("wine_id", item.wine_id);
          }
        }
      }

      // 3. Delete all existing order items
      await supabase.from("order_items").delete().eq("order_id", data.orderId);

      // 4. Insert new order items
      const newOrderItems = data.items.map((item) => ({
        order_id: data.orderId,
        wine_id: item.wine_id,
        wine_name: item.wine_name,
        quantity: item.quantity,
        unit_price: item.unit_price,
        purchase_price: item.purchase_price,
      }));

      const { error: itemsError } = await supabase
        .from("order_items")
        .insert(newOrderItems);

      if (itemsError) throw itemsError;

      // 5. Deduct inventory for new items
      for (const item of data.items) {
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

      return data.orderId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Đã cập nhật đơn hàng");
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
      // First, get order items to restore inventory
      const { data: orderItems, error: itemsError } = await supabase
        .from("order_items")
        .select("wine_id, quantity")
        .eq("order_id", orderId);

      if (itemsError) throw itemsError;

      // Restore inventory quantities
      for (const item of orderItems || []) {
        if (item.wine_id) {
          const { data: inv } = await supabase
            .from("inventory")
            .select("quantity_in_stock")
            .eq("wine_id", item.wine_id)
            .maybeSingle();

          if (inv) {
            await supabase
              .from("inventory")
              .update({ quantity_in_stock: inv.quantity_in_stock + item.quantity })
              .eq("wine_id", item.wine_id);
          }
        }
      }

      // Now delete the order (order_items will be cascade deleted)
      const { error } = await supabase.from("orders").delete().eq("id", orderId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
      toast.success("Đã xóa đơn hàng và khôi phục số lượng kho");
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
  let totalDiscount = 0;
  let totalBottlesSold = 0;
  let salesCount = 0;
  let giftCount = 0;

  orders.forEach((order) => {
    if (order.status === "cancelled") return;

    if (order.order_type === "sale") {
      salesCount++;
    } else {
      giftCount++;
    }

    totalDiscount += order.discount ?? 0;

    order.order_items?.forEach((item) => {
      totalRevenue += item.unit_price * item.quantity;
      totalCost += item.purchase_price * item.quantity;
      totalBottlesSold += item.quantity;
    });
  });

  return {
    totalRevenue,
    totalDiscount,
    netRevenue: totalRevenue - totalDiscount,
    totalCost,
    profit: totalRevenue - totalDiscount - totalCost,
    salesCount,
    giftCount,
    totalBottlesSold,
    totalOrders: salesCount + giftCount,
  };
}
