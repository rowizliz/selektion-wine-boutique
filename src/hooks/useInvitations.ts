import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Invitation {
  id: string;
  title: string;
  event_date: string;
  location: string;
  location_url: string | null;
  dress_code: string | null;
  message: string | null;
  agenda: string | null;
  cover_image_url: string | null;
  pin_code: string;
  url_slug: string;
  created_at: string;
  updated_at: string;
}

export interface InvitationRSVP {
  id: string;
  invitation_id: string;
  guest_name: string;
  phone: string | null;
  attending: boolean;
  guest_count: number;
  note: string | null;
  checked_in_at: string | null;
  created_at: string;
}

export interface CreateInvitationInput {
  title: string;
  event_date: string;
  location: string;
  location_url?: string;
  dress_code?: string;
  message?: string;
  agenda?: string;
  cover_image_url?: string;
  pin_code: string;
  url_slug: string;
}

export interface UpdateInvitationInput extends Partial<CreateInvitationInput> {
  id: string;
}

// Generate URL-friendly slug from title
export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "d")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
};

// Generate random PIN
export const generatePIN = (): string => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

// Fetch all invitations
export const useInvitations = () => {
  return useQuery({
    queryKey: ["invitations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_invitations")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as Invitation[];
    },
  });
};

// Fetch single invitation by ID
export const useInvitation = (id: string) => {
  return useQuery({
    queryKey: ["invitation", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("event_invitations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data as Invitation;
    },
    enabled: !!id,
  });
};

// Fetch RSVPs for an invitation
export const useInvitationRSVPs = (invitationId: string) => {
  return useQuery({
    queryKey: ["invitation-rsvps", invitationId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("invitation_rsvps")
        .select("*")
        .eq("invitation_id", invitationId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data as InvitationRSVP[];
    },
    enabled: !!invitationId,
  });
};

// Create invitation
export const useCreateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (input: CreateInvitationInput) => {
      const { data, error } = await supabase
        .from("event_invitations")
        .insert(input)
        .select()
        .single();

      if (error) throw error;
      return data as Invitation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

// Update invitation
export const useUpdateInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...input }: UpdateInvitationInput) => {
      const { data, error } = await supabase
        .from("event_invitations")
        .update(input)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      return data as Invitation;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
      queryClient.invalidateQueries({ queryKey: ["invitation", data.id] });
    },
  });
};

// Delete invitation
export const useDeleteInvitation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("event_invitations")
        .delete()
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["invitations"] });
    },
  });
};

// Get invitation by slug with PIN verification
export const useInvitationBySlug = (slug: string, pin: string) => {
  return useQuery({
    queryKey: ["invitation-public", slug, pin],
    queryFn: async () => {
      const { data, error } = await supabase
        .rpc("get_invitation_by_slug_with_pin", {
          p_url_slug: slug,
          p_pin_code: pin,
        });

      if (error) throw error;
      if (!data || data.length === 0) return null;
      return data[0] as Omit<Invitation, "pin_code" | "created_at" | "updated_at">;
    },
    enabled: !!slug && !!pin,
  });
};

// Submit RSVP (public endpoint - do not return row data to avoid SELECT/RLS issues)
export const useSubmitRSVP = () => {
  return useMutation({
    mutationFn: async (input: {
      invitation_id: string;
      guest_name: string;
      phone?: string;
      attending: boolean;
      guest_count?: number;
      note?: string;
    }) => {
      const { error } = await supabase.from("invitation_rsvps").insert({
        invitation_id: input.invitation_id,
        guest_name: input.guest_name,
        phone: input.phone || null,
        attending: input.attending,
        guest_count: input.guest_count || 1,
        note: input.note || null,
      });

      if (error) throw error;
    },
  });
};

// Check-in guest
export const useCheckInGuest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ rsvpId, invitationId }: { rsvpId: string; invitationId: string }) => {
      const { data, error } = await supabase
        .from("invitation_rsvps")
        .update({ checked_in_at: new Date().toISOString() })
        .eq("id", rsvpId)
        .select()
        .single();

      if (error) throw error;
      return { data, invitationId };
    },
    onSuccess: ({ invitationId }) => {
      queryClient.invalidateQueries({ queryKey: ["invitation-rsvps", invitationId] });
    },
  });
};
