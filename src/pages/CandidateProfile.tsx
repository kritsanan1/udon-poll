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
      className="min-h-screen pb-8"
      style={{ 
        background: `linear-gradient(180deg, ${candidate.party_color}20 0%, ${candidate.party_color}05 30%, white 100%)`
      }}
    >
      <div className="container max-w-lg mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Link to="/">
            <Button 
              variant="ghost" 
              size="sm"
              className="hover:bg-white/50 transition-colors"
            >
              ← กลับไปหน้าโหวต
            </Button>
          </Link>
        </div>

        {/* Profile Card */}
        <Card 
          className="overflow-hidden rounded-2xl shadow-xl border-2 transition-shadow hover:shadow-2xl"
          style={{ borderColor: `${candidate.party_color}30` }}
        >
          {/* Header with party color gradient */}
          <div 
            className="h-28 relative"
            style={{ 
              background: `linear-gradient(135deg, ${candidate.party_color} 0%, ${candidate.party_color}CC 100%)`
            }}
          >
            {/* Decorative pattern */}
            <div 
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: 'radial-gradient(circle at 20% 50%, white 1px, transparent 1px)',
                backgroundSize: '20px 20px'
              }}
            />
            
            {/* Candidate Number Badge */}
            <div className="absolute top-4 right-4 bg-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg">
              <span 
                className="text-3xl font-bold"
                style={{ color: candidate.party_color }}
              >
                {candidate.candidate_number}
              </span>
            </div>
          </div>

          <CardContent className="pt-0 -mt-20 pb-6">
            {/* Profile Photo */}
            <div className="flex justify-center">
              <div 
                className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-2xl relative"
              >
                <img 
                  src={candidate.photo_url}
                  alt={candidate.name_th}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Name & Party */}
            <div className="text-center mt-5">
              <h1 className="text-2xl font-bold text-foreground">{candidate.name_th}</h1>
              <div className="mt-3">
                <span 
                  className="inline-block px-5 py-1.5 rounded-full text-sm font-semibold shadow-sm"
                  style={{ 
                    backgroundColor: `${candidate.party_color}20`,
                    color: candidate.party_color,
                    border: `1px solid ${candidate.party_color}40`
                  }}
                >
                  {candidate.party_th}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">
                {candidate.party_en}
              </p>
            </div>

            {/* Election Info */}
            <div 
              className="mt-6 p-4 rounded-xl text-center"
              style={{ backgroundColor: `${candidate.party_color}08` }}
            >
              <p className="text-sm text-muted-foreground">ผู้สมัคร ส.ส. เขต 6 อุดรธานี</p>
              <p className="font-semibold text-foreground mt-1">เลือกตั้งซ่อม 8 กุมภาพันธ์ 2569</p>
            </div>

            {/* Facebook Link */}
            {candidate.facebook_url && (
              <div className="mt-5">
                <a 
                  href={candidate.facebook_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block"
                >
                  <Button 
                    className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] hover:shadow-lg"
                    style={{ backgroundColor: '#1877F2' }}
                  >
                    <Facebook className="w-5 h-5 mr-2" />
                    ดูเพจ Facebook
                  </Button>
                </a>
              </div>
            )}

            {/* Navigation */}
            <div className="mt-6 flex justify-between gap-3">
              <Link to={`/candidate/${prevCandidate}`} className="flex-1">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full transition-all hover:scale-[1.02]"
                  style={{ 
                    borderColor: `${candidate.party_color}40`,
                    color: candidate.party_color
                  }}
                >
                  <ChevronLeft className="w-4 h-4 mr-1" />
                  ก่อนหน้า
                </Button>
              </Link>
              <Link to={`/candidate/${nextCandidate}`} className="flex-1">
                <Button 
                  variant="outline" 
                  size="lg"
                  className="w-full transition-all hover:scale-[1.02]"
                  style={{ 
                    borderColor: `${candidate.party_color}40`,
                    color: candidate.party_color
                  }}
                >
                  ถัดไป
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* All Candidates Thumbnails */}
        <div className="mt-8">
          <p className="text-sm text-muted-foreground text-center mb-4 font-medium">ผู้สมัครทั้งหมด</p>
          <div className="flex justify-center gap-3 flex-wrap">
            {allCandidates?.map((c) => (
              <Link 
                key={c.id}
                to={`/candidate/${c.candidate_number}`}
              >
                <div 
                  className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 hover:scale-110 ${
                    c.candidate_number === candidateNumber 
                      ? 'ring-4 scale-110 shadow-lg' 
                      : 'ring-2 hover:ring-4 opacity-80 hover:opacity-100'
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
        <div className="mt-8 text-center">
          <Link to="/">
            <Button 
              size="lg"
              className="h-14 px-8 text-lg font-semibold rounded-xl shadow-lg transition-all hover:scale-105 hover:shadow-xl"
              style={{ 
                background: `linear-gradient(135deg, ${candidate.party_color} 0%, ${candidate.party_color}CC 100%)`
              }}
            >
              🗳️ ไปหน้าลงคะแนน
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
