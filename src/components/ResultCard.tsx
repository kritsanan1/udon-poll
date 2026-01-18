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
      className={`relative transition-all rounded-2xl shadow-lg hover:shadow-xl ${
        isLeader ? 'ring-2 ring-yellow-400 shadow-xl bg-gradient-to-r from-yellow-50 to-amber-50' : 'bg-white'
      }`}
      style={{ 
        borderLeftWidth: '4px', 
        borderLeftColor: candidate.party_color 
      }}
    >
      {isLeader && (
        <div className="absolute -top-3 -right-3 text-2xl drop-shadow-lg">👑</div>
      )}
      
      <CardContent className="p-4">
        <div className="flex items-center gap-4">
          {/* Rank */}
          <div 
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-md"
            style={{ backgroundColor: candidate.party_color }}
          >
            {rank}
          </div>

          {/* Photo with Party Logo */}
          <div className="relative shrink-0">
            <div 
              className="w-14 h-14 rounded-full overflow-hidden ring-2 shadow-md"
              style={{ '--tw-ring-color': candidate.party_color } as React.CSSProperties}
            >
              <img 
                src={candidate.photo_url} 
                alt={candidate.name_th}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            
            {/* Party Logo Badge */}
            {candidate.party_logo_url && (
              <div 
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full overflow-hidden ring-2 ring-white shadow-sm bg-white"
              >
                <img 
                  src={candidate.party_logo_url}
                  alt={`${candidate.party_th} logo`}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-sm">
                หมายเลข {candidate.candidate_number}
              </span>
              <span 
                className="text-xs px-2 py-0.5 rounded-full shadow-sm"
                style={{ 
                  backgroundColor: `${candidate.party_color}15`,
                  color: candidate.party_color,
                  border: `1px solid ${candidate.party_color}30`
                }}
              >
                {candidate.party_th}
              </span>
            </div>
            <p className="font-semibold truncate">{candidate.name_th}</p>
            
            {/* Progress bar */}
            <div className="mt-2">
              <div className="flex justify-between text-xs mb-1">
                <span className="text-muted-foreground">{votes.toLocaleString()} คะแนน</span>
                <span className="font-bold" style={{ color: candidate.party_color }}>
                  {percentage.toFixed(1)}%
                </span>
              </div>
              <Progress 
                value={percentage} 
                className="h-2.5 rounded-full"
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
