import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { Candidate, VoteCount } from '@/types/database';

interface ResultsChartProps {
  candidates: Candidate[];
  voteCounts: VoteCount[];
}

export function ResultsChart({ candidates, voteCounts }: ResultsChartProps) {
  const totalVotes = voteCounts.reduce((sum, v) => sum + v.count, 0);

  const data = candidates
    .map((candidate) => {
      const voteData = voteCounts.find((v) => v.candidate_id === candidate.id);
      const count = voteData?.count || 0;
      const percentage = totalVotes > 0 ? ((count / totalVotes) * 100).toFixed(1) : 0;

      return {
        name: `${candidate.candidate_number}. ${candidate.name_th.split(' ')[0]}`,
        fullName: candidate.name_th,
        party: candidate.party_th,
        votes: count,
        percentage: Number(percentage),
        color: candidate.party_color,
        candidateNumber: candidate.candidate_number,
      };
    })
    .sort((a, b) => b.votes - a.votes);

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <XAxis type="number" />
          <YAxis 
            type="category" 
            dataKey="name" 
            width={120}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload;
                return (
                  <div className="bg-background border rounded-lg p-3 shadow-lg">
                    <p className="font-bold">{data.fullName}</p>
                    <p className="text-sm text-muted-foreground">{data.party}</p>
                    <p className="mt-1">
                      <span className="font-semibold">{data.votes.toLocaleString()}</span> คะแนน
                      <span className="text-muted-foreground ml-1">({data.percentage}%)</span>
                    </p>
                  </div>
                );
              }
              return null;
            }}
          />
          <Bar dataKey="votes" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
