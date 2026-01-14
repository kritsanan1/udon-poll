import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useCandidates } from '@/hooks/useCandidates';
import { useVoteCounts } from '@/hooks/useVotes';
import { usePollSettings } from '@/hooks/usePollSettings';
import { ResultsChart } from '@/components/ResultsChart';
import { Lock, Download, Trash2, RefreshCw } from 'lucide-react';

const ADMIN_PASSWORD = 'udon6admin2569'; // Simple password protection

export default function Admin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isVotingOpen, setIsVotingOpen] = useState(true);

  const { data: candidates } = useCandidates();
  const { data: voteCounts, refetch: refetchVotes } = useVoteCounts();
  const { data: pollSettings, refetch: refetchSettings } = usePollSettings();

  useEffect(() => {
    // Check session
    const savedAuth = sessionStorage.getItem('admin_auth');
    if (savedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  useEffect(() => {
    if (pollSettings) {
      setIsVotingOpen(pollSettings.is_voting_open);
    }
  }, [pollSettings]);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_auth', 'true');
      toast.success('เข้าสู่ระบบสำเร็จ');
    } else {
      toast.error('รหัสผ่านไม่ถูกต้อง');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('admin_auth');
    setPassword('');
  };

  const handleToggleVoting = async () => {
    const newValue = !isVotingOpen;
    
    const { error } = await supabase
      .from('poll_settings')
      .update({ is_voting_open: newValue })
      .eq('id', 1);

    if (error) {
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    setIsVotingOpen(newValue);
    refetchSettings();
    toast.success(newValue ? 'เปิดรับการโหวตแล้ว' : 'ปิดรับการโหวตแล้ว');
  };

  const handleResetVotes = async () => {
    if (!confirm('⚠️ คุณแน่ใจหรือไม่ว่าต้องการลบคะแนนทั้งหมด? การกระทำนี้ไม่สามารถย้อนกลับได้')) {
      return;
    }

    const { error } = await supabase
      .from('votes')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Delete all

    if (error) {
      toast.error('เกิดข้อผิดพลาด');
      return;
    }

    refetchVotes();
    toast.success('ลบคะแนนทั้งหมดแล้ว');
  };

  const handleExportCSV = () => {
    if (!candidates || !voteCounts) return;

    const totalVotes = voteCounts.reduce((sum, v) => sum + v.count, 0);
    
    const rows = candidates.map((candidate) => {
      const voteData = voteCounts.find((v) => v.candidate_id === candidate.id);
      const votes = voteData?.count || 0;
      const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(2) : '0';
      
      return [
        candidate.candidate_number,
        candidate.name_th,
        candidate.party_th,
        votes,
        percentage,
      ].join(',');
    });

    const csv = [
      'หมายเลข,ชื่อ,พรรค,คะแนน,เปอร์เซ็นต์',
      ...rows,
      '',
      `รวมทั้งหมด,,,${totalVotes},100`,
    ].join('\n');

    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `poll-results-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);

    toast.success('ดาวน์โหลดไฟล์ CSV แล้ว');
  };

  const totalVotes = voteCounts?.reduce((sum, v) => sum + v.count, 0) || 0;

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-100 to-white flex items-center justify-center p-4">
        <Card className="max-w-sm w-full">
          <CardHeader className="text-center">
            <Lock className="w-12 h-12 mx-auto text-gray-400 mb-2" />
            <CardTitle>แผงควบคุมผู้ดูแล</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder="กรอกรหัสผ่าน"
                />
              </div>
              <Button onClick={handleLogin} className="w-full">
                เข้าสู่ระบบ
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Admin Dashboard
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">🛡️ แผงควบคุมผู้ดูแล</h1>
          <Button variant="outline" size="sm" onClick={handleLogout}>
            ออกจากระบบ
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{totalVotes.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">โหวตทั้งหมด</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">{candidates?.length || 0}</p>
              <p className="text-sm text-muted-foreground">ผู้สมัคร</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className={`text-2xl font-bold ${isVotingOpen ? 'text-green-600' : 'text-red-600'}`}>
                {isVotingOpen ? '✅' : '❌'}
              </p>
              <p className="text-sm text-muted-foreground">สถานะโหวต</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold">
                {new Date().toLocaleDateString('th-TH')}
              </p>
              <p className="text-sm text-muted-foreground">วันนี้</p>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>⚙️ ควบคุมระบบ</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>เปิด/ปิดการโหวต</Label>
                <p className="text-sm text-muted-foreground">
                  {isVotingOpen ? 'กำลังเปิดรับโหวต' : 'ปิดรับโหวตแล้ว'}
                </p>
              </div>
              <Switch checked={isVotingOpen} onCheckedChange={handleToggleVoting} />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => refetchVotes()}>
                <RefreshCw className="w-4 h-4 mr-2" />
                รีเฟรชข้อมูล
              </Button>
              <Button variant="outline" onClick={handleExportCSV}>
                <Download className="w-4 h-4 mr-2" />
                ส่งออก CSV
              </Button>
              <Button variant="destructive" onClick={handleResetVotes}>
                <Trash2 className="w-4 h-4 mr-2" />
                รีเซ็ตคะแนนทั้งหมด
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Chart */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>📊 กราฟผลคะแนน</CardTitle>
          </CardHeader>
          <CardContent>
            {candidates && voteCounts && (
              <ResultsChart candidates={candidates} voteCounts={voteCounts} />
            )}
          </CardContent>
        </Card>

        {/* Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>📋 ตารางคะแนน</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">หมายเลข</TableHead>
                  <TableHead>ชื่อ</TableHead>
                  <TableHead>พรรค</TableHead>
                  <TableHead className="text-right">คะแนน</TableHead>
                  <TableHead className="text-right">%</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {candidates
                  ?.map((candidate) => {
                    const voteData = voteCounts?.find((v) => v.candidate_id === candidate.id);
                    const votes = voteData?.count || 0;
                    const percentage = totalVotes > 0 ? ((votes / totalVotes) * 100).toFixed(1) : '0';
                    return { candidate, votes, percentage };
                  })
                  .sort((a, b) => b.votes - a.votes)
                  .map(({ candidate, votes, percentage }) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <span 
                          className="inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold text-sm"
                          style={{ backgroundColor: candidate.party_color }}
                        >
                          {candidate.candidate_number}
                        </span>
                      </TableCell>
                      <TableCell className="font-medium">{candidate.name_th}</TableCell>
                      <TableCell>{candidate.party_th}</TableCell>
                      <TableCell className="text-right font-semibold">{votes.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{percentage}%</TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
