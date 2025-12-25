import { useEffect, useRef, useCallback } from 'react';

export const useNotificationSound = (hasPendingRequests: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const hasPendingRef = useRef(hasPendingRequests);

  // Keep ref in sync with prop
  useEffect(() => {
    hasPendingRef.current = hasPendingRequests;
  }, [hasPendingRequests]);

  // Stop all sounds immediately when no pending requests
  useEffect(() => {
    if (!hasPendingRequests) {
      if (beepTimeoutRef.current) {
        clearTimeout(beepTimeoutRef.current);
        beepTimeoutRef.current = null;
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      isPlayingRef.current = false;
    }
  }, [hasPendingRequests]);

  const playNotificationSound = useCallback(() => {
    if (isPlayingRef.current || !hasPendingRef.current) return;
    
    try {
      // Create or resume AudioContext
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      isPlayingRef.current = true;
      
      // Play notification beeps for 30 seconds (every 3 seconds = 10 beeps)
      let beepCount = 0;
      const maxBeeps = 10;
      
      const playBeep = () => {
        // Use ref to get latest value
        if (beepCount >= maxBeeps || !hasPendingRef.current) {
          isPlayingRef.current = false;
          return;
        }

        // Create a pleasant notification sound
        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        // Two-tone notification (like a doorbell)
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        
        oscillator.type = 'sine';
        
        // Envelope for smooth sound
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.25);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        
        beepCount++;
        
        // Schedule next beep after 3 seconds
        if (beepCount < maxBeeps && hasPendingRef.current) {
          beepTimeoutRef.current = setTimeout(playBeep, 3000);
        } else {
          isPlayingRef.current = false;
        }
      };

      playBeep();
    } catch (error) {
      console.error('Error playing notification sound:', error);
      isPlayingRef.current = false;
    }
  }, []);

  useEffect(() => {
    if (hasPendingRequests) {
      // Play immediately
      playNotificationSound();
      
      // Set up 5-minute interval
      intervalRef.current = setInterval(() => {
        if (hasPendingRef.current) {
          playNotificationSound();
        }
      }, 5 * 60 * 1000); // 5 minutes
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasPendingRequests, playNotificationSound]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (beepTimeoutRef.current) {
        clearTimeout(beepTimeoutRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, []);

  return { playNotificationSound };
};
