import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { PollSettings } from '@/types/database';

export function usePollSettings() {
  return useQuery({
    queryKey: ['poll_settings'],
    queryFn: async (): Promise<PollSettings> => {
      const { data, error } = await supabase
        .from('poll_settings')
        .select('*')
        .eq('id', 1)
        .single();

      if (error) throw error;
      return data as PollSettings;
    },
  });
}
