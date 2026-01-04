import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Collaborator {
  id: string;
  user_id: string | null;
  email: string;
  name: string;
  phone: string | null;
  discount_percent: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface CommissionTier {
  id: string;
  min_quantity: number;
  max_quantity: number | null;
  commission_percent: number;
}

export interface CollaboratorOrder {
  id: string;
  collaborator_id: string;
  customer_name: string;
  customer_phone: string | null;
  customer_address: string | null;
  status: string;
  notes: string | null;
  total_amount: number;
  commission_amount: number;
  created_at: string;
  updated_at: string;
  items?: CollaboratorOrderItem[];
}

export interface CollaboratorOrderItem {
  id: string;
  order_id: string;
  wine_id: string | null;
  wine_name: string;
  original_price: number;
  collaborator_price: number;
  quantity: number;
}

// Get all collaborators (admin)
export function useCollaborators() {
  return useQuery({
    queryKey: ["collaborators"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("collaborators")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as Collaborator[];
    },
  });
}

// Get current user's collaborator profile
export function useCurrentCollaborator() {
  return useQuery({
    queryKey: ["current-collaborator"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data, error } = await supabase
        .from("collaborators")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true)
        .maybeSingle();
      
      if (error) throw error;
      return data as Collaborator | null;
    },
  });
}

// Add collaborator (admin)
export function useAddCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { email: string; name: string; phone?: string; discount_percent: number }) => {
      const { data: result, error } = await supabase
        .from("collaborators")
        .insert({
          email: data.email,
          name: data.name,
          phone: data.phone || null,
          discount_percent: data.discount_percent,
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

// Update collaborator (admin)
export function useUpdateCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Collaborator> & { id: string }) => {
      const { error } = await supabase
        .from("collaborators")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

// Delete collaborator (admin)
export function useDeleteCollaborator() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("collaborators").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

// Get commission tiers
export function useCommissionTiers() {
  return useQuery({
    queryKey: ["commission-tiers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("commission_tiers")
        .select("*")
        .order("min_quantity", { ascending: true });
      if (error) throw error;
      return data as CommissionTier[];
    },
  });
}

// Update commission tier (admin)
export function useUpdateCommissionTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<CommissionTier> & { id: string }) => {
      const { error } = await supabase
        .from("commission_tiers")
        .update(data)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-tiers"] });
    },
  });
}

// Add commission tier (admin)
export function useAddCommissionTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { min_quantity: number; max_quantity: number | null; commission_percent: number }) => {
      const { error } = await supabase.from("commission_tiers").insert(data);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-tiers"] });
    },
  });
}

// Delete commission tier (admin)
export function useDeleteCommissionTier() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("commission_tiers").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["commission-tiers"] });
    },
  });
}

// Get collaborator orders (for admin or specific collaborator)
export function useCollaboratorOrders(collaboratorId?: string) {
  return useQuery({
    queryKey: ["collaborator-orders", collaboratorId],
    queryFn: async () => {
      let query = supabase
        .from("collaborator_orders")
        .select(`
          *,
          collaborator_order_items (*)
        `)
        .order("created_at", { ascending: false });

      if (collaboratorId) {
        query = query.eq("collaborator_id", collaboratorId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return data.map(order => ({
        ...order,
        items: order.collaborator_order_items,
      })) as CollaboratorOrder[];
    },
  });
}

// Get accumulated quantity within 30-day session for a collaborator
export function useAccumulatedQuantity(collaboratorId?: string) {
  return useQuery({
    queryKey: ["accumulated-quantity", collaboratorId],
    enabled: !!collaboratorId,
    queryFn: async () => {
      if (!collaboratorId) return { quantity: 0, sessionStart: null, sessionEnd: null };

      // Calculate 30 days ago
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const { data, error } = await supabase
        .from("collaborator_orders")
        .select(`
          created_at,
          collaborator_order_items (quantity)
        `)
        .eq("collaborator_id", collaboratorId)
        .in("status", ["pending", "approved"]) // Count pending and approved orders
        .gte("created_at", thirtyDaysAgo.toISOString())
        .order("created_at", { ascending: true });

      if (error) throw error;

      // Calculate total quantity from orders in the session
      let totalQuantity = 0;
      let sessionStart: string | null = null;

      if (data && data.length > 0) {
        sessionStart = data[0].created_at;
        
        data.forEach(order => {
          const items = order.collaborator_order_items as { quantity: number }[];
          totalQuantity += items.reduce((sum, item) => sum + item.quantity, 0);
        });
      }

      // Calculate session end (30 days from first order in session)
      let sessionEnd: Date | null = null;
      if (sessionStart) {
        sessionEnd = new Date(sessionStart);
        sessionEnd.setDate(sessionEnd.getDate() + 30);
      }

      return {
        quantity: totalQuantity,
        sessionStart,
        sessionEnd: sessionEnd?.toISOString() || null,
        ordersInSession: data?.length || 0,
      };
    },
  });
}

// Create collaborator order
export function useCreateCollaboratorOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      collaborator_id: string;
      customer_name: string;
      customer_phone?: string;
      customer_address?: string;
      notes?: string;
      items: {
        wine_id?: string;
        wine_name: string;
        original_price: number;
        collaborator_price: number;
        quantity: number;
      }[];
    }) => {
      // Calculate totals
      const total_amount = data.items.reduce(
        (sum, item) => sum + item.collaborator_price * item.quantity,
        0
      );

      // Create order
      const { data: order, error: orderError } = await supabase
        .from("collaborator_orders")
        .insert({
          collaborator_id: data.collaborator_id,
          customer_name: data.customer_name,
          customer_phone: data.customer_phone || null,
          customer_address: data.customer_address || null,
          notes: data.notes || null,
          total_amount,
          status: "pending",
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // Create order items
      const { error: itemsError } = await supabase
        .from("collaborator_order_items")
        .insert(
          data.items.map((item) => ({
            order_id: order.id,
            wine_id: item.wine_id || null,
            wine_name: item.wine_name,
            original_price: item.original_price,
            collaborator_price: item.collaborator_price,
            quantity: item.quantity,
          }))
        );

      if (itemsError) throw itemsError;

      return order;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator-orders"] });
    },
  });
}

// Update collaborator order status (admin)
export function useUpdateCollaboratorOrderStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status, commission_amount }: { id: string; status: string; commission_amount?: number }) => {
      const updateData: { status: string; commission_amount?: number } = { status };
      if (commission_amount !== undefined) {
        updateData.commission_amount = commission_amount;
      }
      const { error } = await supabase
        .from("collaborator_orders")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator-orders"] });
    },
  });
}

// Update collaborator order (admin) - edit all fields
export function useUpdateCollaboratorOrder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ 
      id, 
      customer_name, 
      customer_phone, 
      customer_address, 
      notes, 
      status,
      commission_amount 
    }: { 
      id: string; 
      customer_name?: string;
      customer_phone?: string | null;
      customer_address?: string | null;
      notes?: string | null;
      status?: string;
      commission_amount?: number;
    }) => {
      const updateData: Record<string, any> = {};
      if (customer_name !== undefined) updateData.customer_name = customer_name;
      if (customer_phone !== undefined) updateData.customer_phone = customer_phone;
      if (customer_address !== undefined) updateData.customer_address = customer_address;
      if (notes !== undefined) updateData.notes = notes;
      if (status !== undefined) updateData.status = status;
      if (commission_amount !== undefined) updateData.commission_amount = commission_amount;

      const { error } = await supabase
        .from("collaborator_orders")
        .update(updateData)
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["collaborator-orders"] });
      queryClient.invalidateQueries({ queryKey: ["accumulated-quantity"] });
    },
  });
}

// Calculate commission based on quantity
export function calculateCommission(tiers: CommissionTier[], totalQuantity: number, totalAmount: number): number {
  const tier = tiers.find(t => {
    if (t.max_quantity === null) {
      return totalQuantity >= t.min_quantity;
    }
    return totalQuantity >= t.min_quantity && totalQuantity <= t.max_quantity;
  });
  
  if (!tier) return 0;
  return (totalAmount * tier.commission_percent) / 100;
}
