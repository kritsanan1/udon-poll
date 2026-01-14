import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import type { Candidate } from '@/types/database';

export function useCandidates() {
  return useQuery({
    queryKey: ['candidates'],
    queryFn: async (): Promise<Candidate[]> => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .order('candidate_number', { ascending: true });

      if (error) throw error;
      return data as Candidate[];
    },
  });
}

export function useCandidate(candidateNumber: number) {
  return useQuery({
    queryKey: ['candidate', candidateNumber],
    queryFn: async (): Promise<Candidate | null> => {
      const { data, error } = await supabase
        .from('candidates')
        .select('*')
        .eq('candidate_number', candidateNumber)
        .single();

      if (error) throw error;
      return data as Candidate;
    },
    enabled: candidateNumber > 0,
  });
}
