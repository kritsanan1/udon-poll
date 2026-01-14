import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import type { Candidate } from '@/types/database';

interface VoteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  candidate: Candidate | null;
  onConfirm: () => void;
  isLoading: boolean;
}

export function VoteConfirmDialog({
  open,
  onOpenChange,
  candidate,
  onConfirm,
  isLoading,
}: VoteConfirmDialogProps) {
  if (!candidate) return null;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center text-xl">
            ยืนยันการลงคะแนน
          </AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            <div className="mt-4 flex flex-col items-center">
              <div 
                className="w-20 h-20 rounded-full overflow-hidden mb-3 ring-4"
                style={{ '--tw-ring-color': candidate.party_color } as React.CSSProperties}
              >
                <img 
                  src={candidate.photo_url} 
                  alt={candidate.name_th}
                  className="w-full h-full object-cover"
                />
              </div>
              <p className="font-bold text-foreground text-lg">
                หมายเลข {candidate.candidate_number}
              </p>
              <p className="font-semibold text-foreground">
                {candidate.name_th}
              </p>
              <p 
                className="text-sm mt-1 px-3 py-1 rounded-full"
                style={{ 
                  backgroundColor: `${candidate.party_color}20`,
                  color: candidate.party_color,
                }}
              >
                {candidate.party_th}
              </p>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              คุณแน่ใจหรือไม่ว่าต้องการลงคะแนนให้ผู้สมัครท่านนี้?
              <br />
              <span className="text-red-500 font-medium">
                ⚠️ การลงคะแนนไม่สามารถเปลี่ยนแปลงได้
              </span>
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
          <AlertDialogCancel className="w-full sm:w-auto" disabled={isLoading}>
            ยกเลิก
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="w-full sm:w-auto"
            disabled={isLoading}
            style={{ backgroundColor: candidate.party_color }}
          >
            {isLoading ? 'กำลังบันทึก...' : 'ยืนยันลงคะแนน'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
