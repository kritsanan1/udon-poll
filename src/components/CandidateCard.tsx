import { Card, CardContent } from '@/components/ui/card';
import { RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Link } from 'react-router-dom';
import type { Candidate } from '@/types/database';

interface CandidateCardProps {
  candidate: Candidate;
  isSelected: boolean;
  disabled?: boolean;
}

export function CandidateCard({ candidate, isSelected, disabled }: CandidateCardProps) {
  return (
    <Card 
      className={`relative transition-all duration-200 cursor-pointer rounded-2xl shadow-lg hover:shadow-xl ${
        isSelected 
          ? 'ring-2 ring-offset-2 shadow-xl scale-[1.02]' 
          : 'hover:scale-[1.01]'
      } ${disabled ? 'opacity-60 cursor-not-allowed' : ''}`}
      style={{ 
        borderColor: isSelected ? candidate.party_color : 'transparent',
        borderWidth: '2px',
        '--ring-color': candidate.party_color,
      } as React.CSSProperties}
    >
      {/* Candidate Number Badge */}
      <div 
        className="absolute -top-3 -left-3 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg z-10 ring-2 ring-white"
        style={{ backgroundColor: candidate.party_color }}
      >
        {candidate.candidate_number}
      </div>

      <CardContent className="p-4 pt-6">
        <Label 
          htmlFor={`candidate-${candidate.id}`}
          className="flex flex-col items-center cursor-pointer"
        >
          {/* Photo with Party Logo */}
          <div className="relative">
            <div 
              className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 shadow-md"
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
                className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full overflow-hidden ring-2 ring-white shadow-md bg-white"
              >
                <img 
                  src={candidate.party_logo_url}
                  alt={`${candidate.party_th} logo`}
                  className="w-full h-full object-contain p-0.5"
                />
              </div>
            )}
          </div>

          {/* Name */}
          <h3 className="font-bold text-center text-sm mb-1 line-clamp-2">
            {candidate.name_th}
          </h3>

          {/* Party */}
          <p 
            className="text-xs text-center font-medium px-3 py-1 rounded-full shadow-sm"
            style={{ 
              backgroundColor: `${candidate.party_color}15`,
              color: candidate.party_color,
              border: `1px solid ${candidate.party_color}30`
            }}
          >
            {candidate.party_th}
          </p>

          {/* Radio button */}
          <div className="mt-3 flex items-center gap-2">
            <RadioGroupItem 
              value={String(candidate.id)} 
              id={`candidate-${candidate.id}`}
              disabled={disabled}
              className="border-2 w-5 h-5"
              style={{ borderColor: candidate.party_color }}
            />
          </div>

          {/* View Profile Link */}
          <Link 
            to={`/candidate/${candidate.candidate_number}`}
            className="mt-2 text-xs text-muted-foreground hover:text-primary underline transition-colors"
            onClick={(e) => e.stopPropagation()}
          >
            ดูประวัติ
          </Link>
        </Label>
      </CardContent>
    </Card>
  );
}
