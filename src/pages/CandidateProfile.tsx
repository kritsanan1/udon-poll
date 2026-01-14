import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { useCandidate, useCandidates } from '@/hooks/useCandidates';
import { Facebook, ChevronLeft, ChevronRight } from 'lucide-react';

export default function CandidateProfile() {
  const { id } = useParams<{ id: string }>();
  const candidateNumber = parseInt(id || '0');
  
  const { data: candidate, isLoading } = useCandidate(candidateNumber);
  const { data: allCandidates } = useCandidates();

  // Find prev/next candidates
  const prevCandidate = candidateNumber > 1 ? candidateNumber - 1 : 9;
  const nextCandidate = candidateNumber < 9 ? candidateNumber + 1 : 1;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6">
          <div className="flex flex-col items-center">
            <Skeleton className="w-32 h-32 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-32" />
          </div>
        </Card>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-md w-full p-6 text-center">
          <div className="text-6xl mb-4">❌</div>
          <h2 className="text-xl font-bold mb-2">ไม่พบข้อมูลผู้สมัคร</h2>
          <Link to="/">
            <Button className="mt-4">กลับหน้าหลัก</Button>
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen"
      style={{ 
        background: `linear-gradient(135deg, ${candidate.party_color}15 0%, white 100%)`
      }}
    >
      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/">
            <Button variant="ghost" size="sm">
              ← กลับไปหน้าโหวต
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card className="overflow-hidden">
          {/* Header with party color */}
          <div 
            className="h-24 relative"
            style={{ backgroundColor: candidate.party_color }}
          >
            {/* Candidate Number */}
            <div className="absolute top-4 right-4 bg-white/90 rounded-full w-12 h-12 flex items-center justify-center">
              <span className="text-2xl font-bold" style={{ color: candidate.party_color }}>
                {candidate.candidate_number}
              </span>
            </div>
          </div>

          <CardContent className="pt-0 -mt-16">
            {/* Profile Photo */}
            <div className="flex justify-center">
              <div 
                className="w-32 h-32 rounded-full overflow-hidden ring-4 ring-white shadow-xl"
              >
                <img 
                  src={candidate.photo_url}
                  alt={candidate.name_th}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Party */}
            <div className="text-center mt-4">
              <h1 className="text-2xl font-bold">{candidate.name_th}</h1>
              <div className="mt-2">
                <span 
                  className="inline-block px-4 py-1 rounded-full text-sm font-medium"
                  style={{ 
                    backgroundColor: `${candidate.party_color}20`,
                    color: candidate.party_color,
                  }}
                >
                  {candidate.party_th}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                {candidate.party_en}
              </p>
            </div>

            {/* Election Info */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-muted-foreground">ผู้สมัคร ส.ส. เขต 6 อุดรธานี</p>
              <p className="font-semibold">เลือกตั้งซ่อม 8 กุมภาพันธ์ 2569</p>
            </div>

            {/* Facebook Link */}
            {candidate.facebook_url && (
              <div className="mt-4">
                <a 
                  href={candidate.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full"
                    style={{ backgroundColor: '#1877F2' }}
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    ดูเพจ Facebook
                  </Button>
                </a>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between">
              <Link to={`/candidate/${prevCandidate}`}>
                <Button variant="outline" size="sm">
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  ผู้สมัครก่อนหน้า
                </Button>
              </Link>
              <Link to={`/candidate/${nextCandidate}`}>
                <Button variant="outline" size="sm">
                  ผู้สมัครถัดไป
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* All Candidates Thumbnails */}
        <div className="mt-6">
          <p className="text-sm text-muted-foreground text-center mb-3">ผู้สมัครทั้งหมด</p>
          <div className="flex justify-center gap-2 flex-wrap">
            {allCandidates?.map((c) => (
              <Link 
                key={c.id}
                to={`/candidate/${c.candidate_number}`}
              >
                <div 
                  className={`w-10 h-10 rounded-full overflow-hidden ring-2 transition-all hover:scale-110 ${
                    c.candidate_number === candidateNumber ? 'ring-4' : ''
                  }`}
                  style={{ '--tw-ring-color': c.party_color } as React.CSSProperties}
                >
                  <img 
                    src={c.photo_url}
                    alt={c.name_th}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Back to Vote CTA */}
        <div className="mt-6 text-center">
          <Link to="/">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-indigo-600"
            >
              🗳️ ไปหน้าลงคะแนน
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
