import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { PageTransition } from '@/components/PageTransition';
import { useCandidate, useCandidates } from '@/hooks/useCandidates';
import { Facebook, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 rounded-2xl shadow-xl">
            <div className="flex flex-col items-center">
              <Skeleton className="w-40 h-40 rounded-full mb-4" />
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
          </Card>
        </div>
      </PageTransition>
    );
  }

  if (!candidate) {
    return (
      <PageTransition>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
          <Card className="max-w-md w-full p-6 text-center rounded-2xl shadow-xl">
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-xl font-bold mb-2">ไม่พบข้อมูลผู้สมัคร</h2>
            <Link to="/">
              <Button className="mt-4 rounded-xl">กลับหน้าหลัก</Button>
            </Link>
          </Card>
        </div>
      </PageTransition>
    );
  }

  return (
    <PageTransition>
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
                className="hover:bg-white/50 transition-colors rounded-lg"
              >
                ← กลับไปหน้าโหวต
              </Button>
            </Link>
          </div>

          {/* Profile Card with Animation */}
          <AnimatePresence mode="wait">
            <motion.div
              key={candidate.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3, ease: 'easeOut' }}
            >
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
                  {/* Profile Photo with Party Logo */}
                  <div className="flex justify-center">
                    <div className="relative">
                      <motion.div 
                        className="w-40 h-40 rounded-full overflow-hidden ring-4 ring-white shadow-2xl"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.1, duration: 0.3 }}
                      >
                        <img 
                          src={candidate.photo_url}
                          alt={candidate.name_th}
                          className="w-full h-full object-cover"
                        />
                      </motion.div>
                      
                      {/* Party Logo Badge */}
                      {candidate.party_logo_url && (
                        <motion.div 
                          className="absolute -bottom-1 -right-1 w-12 h-12 rounded-full overflow-hidden ring-3 ring-white shadow-lg bg-white"
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.2, duration: 0.3 }}
                        >
                          <img 
                            src={candidate.party_logo_url}
                            alt={`${candidate.party_th} logo`}
                            className="w-full h-full object-contain p-1"
                          />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Name & Party */}
                  <motion.div 
                    className="text-center mt-5"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.15, duration: 0.3 }}
                  >
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
                  </motion.div>

                  {/* Election Info */}
                  <motion.div 
                    className="mt-6 p-4 rounded-xl text-center"
                    style={{ backgroundColor: `${candidate.party_color}08` }}
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <p className="text-sm text-muted-foreground">ผู้สมัคร ส.ส. เขต 6 อุดรธานี</p>
                    <p className="font-semibold text-foreground mt-1">เลือกตั้งซ่อม 8 กุมภาพันธ์ 2569</p>
                  </motion.div>

                  {/* Facebook Link */}
                  {candidate.facebook_url && (
                    <motion.div 
                      className="mt-5"
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      transition={{ delay: 0.25, duration: 0.3 }}
                    >
                      <a 
                        href={candidate.facebook_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block"
                      >
                        <Button 
                          className="w-full h-12 text-base font-medium transition-all hover:scale-[1.02] hover:shadow-lg rounded-xl"
                          style={{ backgroundColor: '#1877F2' }}
                        >
                          <Facebook className="w-5 h-5 mr-2" />
                          ดูเพจ Facebook
                        </Button>
                      </a>
                    </motion.div>
                  )}

                  {/* Navigation */}
                  <motion.div 
                    className="mt-6 flex justify-between gap-3"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.3 }}
                  >
                    <Link to={`/candidate/${prevCandidate}`} className="flex-1">
                      <Button 
                        variant="outline" 
                        size="lg"
                        className="w-full transition-all hover:scale-[1.02] rounded-xl"
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
                        className="w-full transition-all hover:scale-[1.02] rounded-xl"
                        style={{ 
                          borderColor: `${candidate.party_color}40`,
                          color: candidate.party_color
                        }}
                      >
                        ถัดไป
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Button>
                    </Link>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </AnimatePresence>

          {/* All Candidates Thumbnails */}
          <motion.div 
            className="mt-8"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.35, duration: 0.3 }}
          >
            <p className="text-sm text-muted-foreground text-center mb-4 font-medium">ผู้สมัครทั้งหมด</p>
            <div className="flex justify-center gap-3 flex-wrap">
              {allCandidates?.map((c) => (
                <Link 
                  key={c.id}
                  to={`/candidate/${c.candidate_number}`}
                >
                  <motion.div 
                    className={`w-12 h-12 rounded-full overflow-hidden transition-all duration-200 ${
                      c.candidate_number === candidateNumber 
                        ? 'ring-4 scale-110 shadow-lg' 
                        : 'ring-2 hover:ring-4 opacity-80 hover:opacity-100'
                    }`}
                    style={{ '--tw-ring-color': c.party_color } as React.CSSProperties}
                    whileHover={{ scale: c.candidate_number === candidateNumber ? 1.1 : 1.15 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <img 
                      src={c.photo_url}
                      alt={c.name_th}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Back to Vote CTA */}
          <motion.div 
            className="mt-8 text-center"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
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
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
}
