import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingRequestCounts = () => {
  return useQuery({
    queryKey: ['pending-request-counts'],
    queryFn: async () => {
      const [birthdayResult, personalizedResult, profileUpdatesResult, withdrawalsResult, collaboratorOrdersResult, passwordRequestsResult, applicationsResult, contactMessagesResult] = await Promise.all([
        supabase
          .from('birthday_gift_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('personalized_wine_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('collaborator_profile_updates')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('withdrawal_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('collaborator_orders')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('password_change_requests')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('collaborator_applications')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'pending'),
        supabase
          .from('contact_messages')
          .select('id', { count: 'exact', head: true })
          .eq('status', 'unread')
      ]);

      return {
        birthdayGiftsPending: birthdayResult.count ?? 0,
        personalizedWinePending: personalizedResult.count ?? 0,
        profileUpdatesPending: profileUpdatesResult.count ?? 0,
        withdrawalsPending: withdrawalsResult.count ?? 0,
        collaboratorOrdersPending: collaboratorOrdersResult.count ?? 0,
        passwordRequestsPending: passwordRequestsResult.count ?? 0,
        applicationsPending: applicationsResult.count ?? 0,
        contactMessagesPending: contactMessagesResult.count ?? 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
