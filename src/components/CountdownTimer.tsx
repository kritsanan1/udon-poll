import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';

interface CountdownTimerProps {
  targetDate: Date;
}

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

export function CountdownTimer({ targetDate }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference <= 0) {
        setIsExpired(true);
        return null;
      }

      return {
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((difference % (1000 * 60)) / 1000),
      };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isExpired) {
    return (
      <Card className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 text-center">
        <p className="text-lg font-bold">🗳️ การเลือกตั้งสิ้นสุดแล้ว</p>
      </Card>
    );
  }

  if (!timeLeft) return null;

  const timeUnits = [
    { label: 'วัน', value: timeLeft.days },
    { label: 'ชั่วโมง', value: timeLeft.hours },
    { label: 'นาที', value: timeLeft.minutes },
    { label: 'วินาที', value: timeLeft.seconds },
  ];

  return (
    <Card className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white p-4">
      <p className="text-center text-sm mb-3 opacity-90">⏰ นับถอยหลังสู่วันเลือกตั้ง</p>
      <div className="flex justify-center gap-3">
        {timeUnits.map((unit) => (
          <div key={unit.label} className="text-center">
            <div className="bg-white/20 backdrop-blur rounded-lg px-3 py-2 min-w-[60px]">
              <span className="text-2xl font-bold tabular-nums">
                {String(unit.value).padStart(2, '0')}
              </span>
            </div>
            <span className="text-xs mt-1 block opacity-80">{unit.label}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}
