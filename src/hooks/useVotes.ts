import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import type { VoteCount } from '@/types/database';

interface CandidateVoteResult {
  candidate_id: number;
}

export function useVoteCounts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['vote_counts'],
    queryFn: async (): Promise<VoteCount[]> => {
      const { data, error } = await supabase
        .from('votes')
        .select('candidate_id');

      if (error) throw error;

      // Count votes per candidate
      const counts: Record<number, number> = {};
      (data as CandidateVoteResult[]).forEach((vote) => {
        counts[vote.candidate_id] = (counts[vote.candidate_id] || 0) + 1;
      });

      return Object.entries(counts).map(([candidate_id, count]) => ({
        candidate_id: parseInt(candidate_id),
        count,
      }));
    },
    refetchInterval: 30000, // Auto-refresh every 30 seconds
  });

  // Subscribe to realtime updates
  useEffect(() => {
    const channel = supabase
      .channel('votes-realtime')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'votes',
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ['vote_counts'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return query;
}

export function useHasVoted(fingerprint: string | null) {
  return useQuery({
    queryKey: ['has_voted', fingerprint],
    queryFn: async (): Promise<boolean> => {
      if (!fingerprint) return false;

      const { data, error } = await supabase
        .from('votes')
        .select('id')
        .eq('fingerprint_hash', fingerprint)
        .maybeSingle();

      if (error) throw error;
      return !!data;
    },
    enabled: !!fingerprint,
  });
}

export function useSubmitVote() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      candidateId,
      fingerprint,
    }: {
      candidateId: number;
      fingerprint: string;
    }) => {
      const { data, error } = await supabase
        .from('votes')
        .insert({
          candidate_id: candidateId,
          fingerprint_hash: fingerprint,
        })
        .select()
        .single();

      if (error) {
        if (error.code === '23505') {
          // Unique constraint violation
          throw new Error('คุณได้ลงคะแนนแล้ว');
        }
        throw error;
      }

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['vote_counts'] });
      queryClient.invalidateQueries({ queryKey: ['has_voted'] });
    },
  });
}
