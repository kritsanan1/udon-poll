import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Candidate } from '@/types/database';

interface ResultCardProps {
  candidate: Candidate;
  votes: number;
  percentage: number;
  rank: number;
}

export function ResultCard({ candidate, votes, percentage, rank }: ResultCardProps) {
  const isLeader = rank === 1;

  return (
    <Card 
      className={`relative transition-all ${isLeader ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}
      style={{ borderLeftWidth: '4px', borderLeftColor: candidate.party_color }}
    >
      {isLeader && (
        <div className="absolute -top-3 -right-3 text-2xl">👑</div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div 
            className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0"
            style={{ backgroundColor: candidate.party_color }}
          >
            {rank}
          </div>

          {/* Photo */}
          <div 
            className="w-12 h-12 rounded-full overflow-hidden ring-2 shrink-0"
            style={{ '--tw-ring-color': candidate.party_color } as React.CSSProperties}
          >
            <img 
              src={candidate.photo_url} 
              alt={candidate.name_th}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">
                หมายเลข {candidate.candidate_number}
              </span>
              <span 
                className="text-xs px-2 py-0.5 rounded-full"
                style={{ 
                  backgroundColor: `${candidate.party_color}20`,
                  color: candidate.party_color,
                }}
              >
                {candidate.party_th}
              </span>
            </div>
            <p className="font-semibold truncate">{candidate.name_th}</p>
            
            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span>{votes.toLocaleString()} คะแนน</span>
                <span className="font-semibold">{percentage.toFixed(1)}%</span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2"
                style={{ 
                  '--progress-foreground': candidate.party_color 
                } as React.CSSProperties}
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
