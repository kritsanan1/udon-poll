import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Facebook, Twitter, Link2, MessageCircle } from 'lucide-react';

interface SocialShareProps {
  url?: string;
  title?: string;
}

export function SocialShare({ 
  url = window.location.origin + '/results',
  title = 'ผลโหวตสำรวจความนิยม เขต 6 อุดรธานี'
}: SocialShareProps) {
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
    line: `https://social-plugins.line.me/lineit/share?url=${encodedUrl}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('คัดลอกลิงก์แล้ว!');
    } catch {
      toast.error('ไม่สามารถคัดลอกลิงก์ได้');
    }
  };

  const handleShare = (platform: keyof typeof shareLinks) => {
    window.open(shareLinks[platform], '_blank', 'width=600,height=400');
  };

  return (
    <div className="flex flex-wrap gap-2 justify-center">
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('facebook')}
        className="bg-[#1877F2] text-white hover:bg-[#166FE5] border-none"
      >
        <Facebook className="w-4 h-4 mr-2" />
        Facebook
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('twitter')}
        className="bg-black text-white hover:bg-gray-800 border-none"
      >
        <Twitter className="w-4 h-4 mr-2" />
        X
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={() => handleShare('line')}
        className="bg-[#00B900] text-white hover:bg-[#00A000] border-none"
      >
        <MessageCircle className="w-4 h-4 mr-2" />
        LINE
      </Button>
      
      <Button 
        variant="outline" 
        size="sm"
        onClick={handleCopyLink}
      >
        <Link2 className="w-4 h-4 mr-2" />
        คัดลอกลิงก์
      </Button>
    </div>
  );
}
