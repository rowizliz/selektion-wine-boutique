import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface WithdrawalRequest {
  id: string;
  collaborator_id: string;
  amount: number;
  status: string;
  transfer_proof_url: string | null;
  admin_notes: string | null;
  created_at: string;
  processed_at: string | null;
  processed_by: string | null;
}

// Get withdrawal requests for current collaborator
export function useCollaboratorWithdrawals(collaboratorId?: string) {
  return useQuery({
    queryKey: ["withdrawals", collaboratorId],
    enabled: !!collaboratorId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .eq("collaborator_id", collaboratorId!)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WithdrawalRequest[];
    },
  });
}

// Get all withdrawal requests (admin)
export function useAllWithdrawals() {
  return useQuery({
    queryKey: ["all-withdrawals"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as WithdrawalRequest[];
    },
  });
}

// Create withdrawal request
export function useCreateWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { collaborator_id: string; amount: number }) => {
      const { data: result, error } = await supabase
        .from("withdrawal_requests")
        .insert({
          collaborator_id: data.collaborator_id,
          amount: data.amount,
          status: "pending",
        })
        .select()
        .single();
      if (error) throw error;
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["withdrawals", variables.collaborator_id] });
      queryClient.invalidateQueries({ queryKey: ["all-withdrawals"] });
    },
  });
}

// Check if can request withdrawal (once per week)
export function useCanRequestWithdrawal(collaboratorId?: string) {
  return useQuery({
    queryKey: ["can-withdraw", collaboratorId],
    enabled: !!collaboratorId,
    queryFn: async () => {
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

      const { data, error } = await supabase
        .from("withdrawal_requests")
        .select("id, created_at")
        .eq("collaborator_id", collaboratorId!)
        .gte("created_at", oneWeekAgo.toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        const lastRequest = new Date(data[0].created_at);
        const nextAllowedDate = new Date(lastRequest);
        nextAllowedDate.setDate(nextAllowedDate.getDate() + 7);
        return {
          canRequest: false,
          nextAllowedDate: nextAllowedDate.toISOString(),
          lastRequestDate: lastRequest.toISOString(),
        };
      }

      return { canRequest: true, nextAllowedDate: null, lastRequestDate: null };
    },
  });
}

// Process withdrawal request (admin)
export function useProcessWithdrawal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      status,
      transfer_proof_url,
      admin_notes,
      deduct_from_wallet,
      collaborator_id,
      amount,
    }: {
      id: string;
      status: "approved" | "rejected";
      transfer_proof_url?: string;
      admin_notes?: string;
      deduct_from_wallet?: boolean;
      collaborator_id?: string;
      amount?: number;
    }) => {
      // Update withdrawal request
      const { error: updateError } = await supabase
        .from("withdrawal_requests")
        .update({
          status,
          transfer_proof_url: transfer_proof_url || null,
          admin_notes: admin_notes || null,
          processed_at: new Date().toISOString(),
        })
        .eq("id", id);

      if (updateError) throw updateError;

      // Deduct from wallet if approved
      if (status === "approved" && deduct_from_wallet && collaborator_id && amount) {
        const { data: collab, error: fetchError } = await supabase
          .from("collaborators")
          .select("wallet_balance")
          .eq("id", collaborator_id)
          .single();

        if (fetchError) throw fetchError;

        const newBalance = Math.max(0, (collab?.wallet_balance || 0) - amount);
        
        const { error: walletError } = await supabase
          .from("collaborators")
          .update({ wallet_balance: newBalance })
          .eq("id", collaborator_id);

        if (walletError) throw walletError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["withdrawals"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
      queryClient.invalidateQueries({ queryKey: ["current-collaborator"] });
    },
  });
}

// Update collaborator bank info
export function useUpdateCollaboratorBankInfo() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      id,
      bank_name,
      bank_account_number,
      bank_account_holder,
      qr_code_url,
    }: {
      id: string;
      bank_name?: string;
      bank_account_number?: string;
      bank_account_holder?: string;
      qr_code_url?: string;
    }) => {
      const updateData: Record<string, any> = {};
      if (bank_name !== undefined) updateData.bank_name = bank_name;
      if (bank_account_number !== undefined) updateData.bank_account_number = bank_account_number;
      if (bank_account_holder !== undefined) updateData.bank_account_holder = bank_account_holder;
      if (qr_code_url !== undefined) updateData.qr_code_url = qr_code_url;

      const { error } = await supabase
        .from("collaborators")
        .update(updateData)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["current-collaborator"] });
      queryClient.invalidateQueries({ queryKey: ["collaborators"] });
    },
  });
}

// Upload QR code image
export async function uploadQRCode(file: File, collaboratorId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `qr-codes/${collaboratorId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("collaborator-files")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("collaborator-files")
    .getPublicUrl(fileName);

  return data.publicUrl;
}

// Upload transfer proof image (admin)
export async function uploadTransferProof(file: File, withdrawalId: string): Promise<string> {
  const fileExt = file.name.split(".").pop();
  const fileName = `transfer-proofs/${withdrawalId}-${Date.now()}.${fileExt}`;

  const { error: uploadError } = await supabase.storage
    .from("collaborator-files")
    .upload(fileName, file, { upsert: true });

  if (uploadError) throw uploadError;

  const { data } = supabase.storage
    .from("collaborator-files")
    .getPublicUrl(fileName);

  return data.publicUrl;
}
