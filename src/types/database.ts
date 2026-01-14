export interface Candidate {
  id: number;
  candidate_number: number;
  name_th: string;
  party_th: string;
  party_en: string;
  party_color: string;
  photo_url: string;
  facebook_url: string | null;
  created_at: string;
}

export interface Vote {
  id: string;
  candidate_id: number;
  fingerprint_hash: string;
  created_at: string;
}

export interface PollSettings {
  id: number;
  is_voting_open: boolean;
  election_date: string;
  created_at: string;
  updated_at: string;
}

export interface VoteCount {
  candidate_id: number;
  count: number;
}
