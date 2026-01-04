import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export const usePendingRequestCounts = () => {
  return useQuery({
    queryKey: ['pending-request-counts'],
    queryFn: async () => {
      const [birthdayResult, personalizedResult, profileUpdatesResult, withdrawalsResult] = await Promise.all([
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
          .eq('status', 'pending')
      ]);

      return {
        birthdayGiftsPending: birthdayResult.count ?? 0,
        personalizedWinePending: personalizedResult.count ?? 0,
        profileUpdatesPending: profileUpdatesResult.count ?? 0,
        withdrawalsPending: withdrawalsResult.count ?? 0
      };
    },
    refetchInterval: 30000 // Refresh every 30 seconds
  });
};
