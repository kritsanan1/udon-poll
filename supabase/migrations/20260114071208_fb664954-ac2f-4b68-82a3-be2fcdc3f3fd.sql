-- Add policy for vote_logs (admin only via edge function)
-- Since there's no auth, we'll restrict direct access and use edge functions
CREATE POLICY "Deny direct access to vote_logs" 
ON public.vote_logs 
FOR SELECT 
USING (false);

-- Note: The votes INSERT policy with "true" is intentional for this anonymous poll
-- Duplicate prevention is handled by the UNIQUE constraint on fingerprint_hash