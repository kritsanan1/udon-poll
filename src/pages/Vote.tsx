import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RadioGroup } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { CountdownTimer } from '@/components/CountdownTimer';
import { CandidateCard } from '@/components/CandidateCard';
import { VoteConfirmDialog } from '@/components/VoteConfirmDialog';
import { useCandidates } from '@/hooks/useCandidates';
import { usePollSettings } from '@/hooks/usePollSettings';
import { useFingerprint } from '@/hooks/useFingerprint';
import { useHasVoted, useSubmitVote } from '@/hooks/useVotes';

export default function Vote() {
  const navigate = useNavigate();
  const [selectedCandidate, setSelectedCandidate] = useState<string>('');
  const [showConfirm, setShowConfirm] = useState(false);

  const { data: candidates, isLoading: candidatesLoading } = useCandidates();
  const { data: pollSettings, isLoading: settingsLoading } = usePollSettings();
  const { fingerprint, loading: fingerprintLoading } = useFingerprint();
  const { data: hasVoted, isLoading: hasVotedLoading } = useHasVoted(fingerprint);
  const submitVote = useSubmitVote();

  const isLoading = candidatesLoading || settingsLoading || fingerprintLoading || hasVotedLoading;

  // Election date: February 8, 2026 (Buddhist year 2569)
  const electionDate = pollSettings?.election_date 
    ? new Date(pollSettings.election_date) 
    : new Date('2026-02-08T00:00:00+07:00');

  const selectedCandidateData = candidates?.find(
    (c) => String(c.id) === selectedCandidate
  );

  const handleVoteClick = () => {
    if (!selectedCandidate) {
      toast.error('กรุณาเลือกผู้สมัครที่ต้องการลงคะแนน');
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmVote = async () => {
    if (!selectedCandidateData || !fingerprint) return;

    try {
      await submitVote.mutateAsync({
        candidateId: selectedCandidateData.id,
        fingerprint,
      });
      
      localStorage.setItem('has_voted', 'true');
      toast.success('ลงคะแนนเรียบร้อยแล้ว! ขอบคุณที่มีส่วนร่วม');
      navigate('/results');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('เกิดข้อผิดพลาด กรุณาลองใหม่อีกครั้ง');
      }
    } finally {
      setShowConfirm(false);
    }
  };

  // Redirect if already voted
  if (hasVoted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h2 className="text-xl font-bold mb-2">คุณได้ลงคะแนนแล้ว</h2>
          <p className="text-muted-foreground mb-4">
            ขอบคุณที่มีส่วนร่วมในการสำรวจความคิดเห็น
          </p>
          <Button onClick={() => navigate('/results')} className="w-full">
            ดูผลโหวต
          </Button>
        </Card>
      </div>
    );
  }

  // Check if voting is closed
  if (pollSettings && !pollSettings.is_voting_open) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-xl font-bold mb-2">การลงคะแนนปิดแล้ว</h2>
          <p className="text-muted-foreground mb-4">
            ขณะนี้ไม่อยู่ในช่วงเวลาที่เปิดรับการลงคะแนน
          </p>
          <Button onClick={() => navigate('/results')} className="w-full">
            ดูผลโหวต
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <header className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            🗳️ โพลสำรวจความนิยม
          </h1>
          <h2 className="text-lg md:text-xl font-semibold text-blue-700">
            เลือกตั้งซ่อม ส.ส. เขต 6 อุดรธานี
          </h2>
          <p className="text-muted-foreground mt-1">
            8 กุมภาพันธ์ 2569
          </p>
        </header>

        {/* Countdown Timer */}
        <div className="mb-6">
          <CountdownTimer targetDate={electionDate} />
        </div>

        {/* Candidates Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 9 }).map((_, i) => (
              <Card key={i} className="p-4">
                <div className="flex flex-col items-center">
                  <Skeleton className="w-24 h-24 rounded-full mb-3" />
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </Card>
            ))}
          </div>
        ) : (
          <>
            <RadioGroup
              value={selectedCandidate}
              onValueChange={setSelectedCandidate}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            >
              {candidates?.map((candidate) => (
                <CandidateCard
                  key={candidate.id}
                  candidate={candidate}
                  isSelected={selectedCandidate === String(candidate.id)}
                />
              ))}
            </RadioGroup>

            {/* Vote Button */}
            <div className="mt-8 flex flex-col items-center gap-4">
              <Button
                size="lg"
                className="w-full max-w-sm text-lg py-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleVoteClick}
                disabled={!selectedCandidate}
              >
                🗳️ ลงคะแนน
              </Button>
              
              <Button
                variant="ghost"
                onClick={() => navigate('/results')}
                className="text-muted-foreground"
              >
                ดูผลโหวตปัจจุบัน →
              </Button>
            </div>
          </>
        )}

        {/* Disclaimer */}
        <footer className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            ⚠️ นี่เป็นเพียงโพลสำรวจความคิดเห็นไม่เป็นทางการ
            <br />
            ไม่มีผลต่อการเลือกตั้งจริง
          </p>
        </footer>
      </div>

      {/* Confirm Dialog */}
      <VoteConfirmDialog
        open={showConfirm}
        onOpenChange={setShowConfirm}
        candidate={selectedCandidateData || null}
        onConfirm={handleConfirmVote}
        isLoading={submitVote.isPending}
      />
    </div>
  );
}
