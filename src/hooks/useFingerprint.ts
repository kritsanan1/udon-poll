import { useState, useEffect } from 'react';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

export function useFingerprint() {
  const [fingerprint, setFingerprint] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getFingerprint = async () => {
      try {
        const fp = await FingerprintJS.load();
        const result = await fp.get();
        setFingerprint(result.visitorId);
      } catch (error) {
        console.error('Failed to get fingerprint:', error);
        // Fallback to localStorage-based ID
        let fallbackId = localStorage.getItem('voter_id');
        if (!fallbackId) {
          fallbackId = crypto.randomUUID();
          localStorage.setItem('voter_id', fallbackId);
        }
        setFingerprint(fallbackId);
      } finally {
        setLoading(false);
      }
    };

    getFingerprint();
  }, []);

  return { fingerprint, loading };
}
