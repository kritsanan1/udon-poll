import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { CountdownTimer } from '@/components/CountdownTimer';
import { ResultsChart } from '@/components/ResultsChart';
import { ResultCard } from '@/components/ResultCard';
import { SocialShare } from '@/components/SocialShare';
import { PageTransition } from '@/components/PageTransition';
import { useCandidates } from '@/hooks/useCandidates';
import { usePollSettings } from '@/hooks/usePollSettings';
import { useVoteCounts } from '@/hooks/useVotes';
import { RefreshCw, BarChart3, Users } from 'lucide-react';

export default function Results() {
  const { data: candidates, isLoading: candidatesLoading } = useCandidates();
  const { data: pollSettings } = usePollSettings();
  const { data: voteCounts, isLoading: votesLoading, refetch, dataUpdatedAt } = useVoteCounts();

  const isLoading = candidatesLoading || votesLoading;

  const electionDate = pollSettings?.election_date 
    ? new Date(pollSettings.election_date) 
    : new Date('2026-02-08T00:00:00+07:00');

  const totalVotes = voteCounts?.reduce((sum, v) => sum + v.count, 0) || 0;

  // Sort candidates by vote count
  const sortedResults = candidates
    ?.map((candidate) => {
      const voteData = voteCounts?.find((v) => v.candidate_id === candidate.id);
      const votes = voteData?.count || 0;
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0;
      return { candidate, votes, percentage };
    })
    .sort((a, b) => b.votes - a.votes);

  const lastUpdated = dataUpdatedAt 
    ? new Date(dataUpdatedAt).toLocaleTimeString('th-TH', { 
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
      })
    : '';

  return (
    <PageTransition>
      <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
        {/* Gradient Header */}
        <div 
          className="h-32 relative rounded-b-3xl shadow-lg"
          style={{ 
            background: 'linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)'
          }}
        >
          {/* Decorative pattern */}
          <div 
            className="absolute inset-0 opacity-10 rounded-b-3xl"
            style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
              backgroundSize: '20px 20px'
            }}
          />
          
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
            <h1 className="text-2xl md:text-3xl font-bold drop-shadow-lg">
              📊 ผลโหวตสำรวจความนิยม
            </h1>
            <p className="text-white/90 mt-1 text-sm md:text-base">
              เลือกตั้งซ่อม ส.ส. เขต 6 อุดรธานี
            </p>
          </div>
        </div>

        <div className="container max-w-4xl mx-auto px-4 py-6 -mt-6">
          {/* Election Date Badge */}
          <div className="flex justify-center mb-4">
            <div className="bg-white px-6 py-2 rounded-full shadow-lg border">
              <p className="text-sm font-semibold text-gray-700">
                📅 8 กุมภาพันธ์ 2569
              </p>
            </div>
          </div>

          {/* Countdown Timer */}
          <div className="mb-6">
            <CountdownTimer targetDate={electionDate} />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ผู้ร่วมโหวต</p>
                  <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="rounded-2xl shadow-lg border-0 bg-white/80 backdrop-blur">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="p-3 bg-gradient-to-br from-green-100 to-green-200 rounded-xl">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">ผู้สมัคร</p>
                  <p className="text-2xl font-bold">{candidates?.length || 0}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Refresh & Last Updated */}
          <div className="flex items-center justify-between mb-4 bg-white/60 rounded-xl px-4 py-2 shadow-sm">
            <span className="text-sm text-muted-foreground">
              อัปเดตล่าสุด: {lastUpdated}
            </span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => refetch()}
              className="rounded-lg hover:bg-indigo-50"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              รีเฟรช
            </Button>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Card key={i} className="p-4 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <Skeleton className="w-8 h-8 rounded-full" />
                    <Skeleton className="w-12 h-12 rounded-full" />
                    <div className="flex-1">
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <>
              {/* Chart */}
              <Card className="mb-6 rounded-2xl shadow-lg border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-indigo-50 to-purple-50">
                  <CardTitle className="text-lg">📈 กราฟแสดงผลคะแนน</CardTitle>
                </CardHeader>
                <CardContent className="p-4">
                  {candidates && voteCounts && (
                    <ResultsChart candidates={candidates} voteCounts={voteCounts} />
                  )}
                </CardContent>
              </Card>

              {/* Results List */}
              <div className="space-y-3">
                {sortedResults?.map((result, index) => (
                  <ResultCard
                    key={result.candidate.id}
                    candidate={result.candidate}
                    votes={result.votes}
                    percentage={result.percentage}
                    rank={index + 1}
                  />
                ))}
              </div>

              {/* Social Share */}
              <Card className="mt-6 rounded-2xl shadow-lg border-0 overflow-hidden">
                <CardContent className="p-5 text-center bg-gradient-to-r from-indigo-50 to-purple-50">
                  <p className="mb-3 font-semibold text-gray-700">แชร์ผลโหวตให้เพื่อนๆ</p>
                  <SocialShare />
                </CardContent>
              </Card>

              {/* Back to Vote */}
              <div className="mt-6 text-center">
                <Link to="/">
                  <Button 
                    variant="outline"
                    size="lg"
                    className="h-12 px-8 rounded-xl shadow-md hover:shadow-lg transition-all hover:scale-[1.02]"
                  >
                    ← กลับไปหน้าโหวต
                  </Button>
                </Link>
              </div>
            </>
          )}

          {/* Disclaimer */}
          <footer className="mt-8 text-center text-xs text-muted-foreground">
            <p className="bg-yellow-50 border border-yellow-200 rounded-xl px-4 py-3 inline-block">
              ⚠️ นี่เป็นเพียงโพลสำรวจความคิดเห็นไม่เป็นทางการ
              <br />
              ไม่มีผลต่อการเลือกตั้งจริง
            </p>
          </footer>
        </div>
      </div>
    </PageTransition>
  );
}
