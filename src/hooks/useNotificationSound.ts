import { useEffect, useRef, useCallback, useState } from 'react';

export const useNotificationSound = (hasPendingRequests: boolean) => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const beepTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isPlayingRef = useRef(false);
  const hasPendingRef = useRef(hasPendingRequests);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    return localStorage.getItem('admin-notification-sound') === 'true';
  });

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

  const enableSound = useCallback(() => {
    // Create AudioContext on user interaction to bypass autoplay restrictions
    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContext();
    }
    
    // Resume if suspended
    if (audioContextRef.current.state === 'suspended') {
      audioContextRef.current.resume();
    }
    
    setSoundEnabled(true);
    localStorage.setItem('admin-notification-sound', 'true');
    
    // Play a test beep to confirm sound is working
    playBeepOnce();
  }, []);

  const disableSound = useCallback(() => {
    setSoundEnabled(false);
    localStorage.setItem('admin-notification-sound', 'false');
    
    // Stop any playing sounds
    if (beepTimeoutRef.current) {
      clearTimeout(beepTimeoutRef.current);
      beepTimeoutRef.current = null;
    }
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    isPlayingRef.current = false;
  }, []);

  const playBeepOnce = useCallback(() => {
    if (!audioContextRef.current) return;
    
    const ctx = audioContextRef.current;
    if (ctx.state === 'suspended') {
      ctx.resume();
    }

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
    oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
    
    oscillator.type = 'sine';
    
    gainNode.gain.setValueAtTime(0, ctx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
    gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
    gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.25);
    gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.4);
  }, []);

  const playNotificationSound = useCallback(() => {
    if (isPlayingRef.current || !hasPendingRef.current || !soundEnabled) return;
    
    try {
      if (!audioContextRef.current) {
        audioContextRef.current = new AudioContext();
      }
      
      const ctx = audioContextRef.current;
      if (ctx.state === 'suspended') {
        ctx.resume();
      }

      isPlayingRef.current = true;
      
      let beepCount = 0;
      const maxBeeps = 10;
      
      const playBeep = () => {
        if (beepCount >= maxBeeps || !hasPendingRef.current || !soundEnabled) {
          isPlayingRef.current = false;
          return;
        }

        const oscillator = ctx.createOscillator();
        const gainNode = ctx.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(ctx.destination);
        
        oscillator.frequency.setValueAtTime(800, ctx.currentTime);
        oscillator.frequency.setValueAtTime(600, ctx.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, ctx.currentTime + 0.2);
        
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.05);
        gainNode.gain.linearRampToValueAtTime(0.2, ctx.currentTime + 0.15);
        gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + 0.25);
        gainNode.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.4);
        
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.4);
        
        beepCount++;
        
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
  }, [soundEnabled]);

  useEffect(() => {
    if (hasPendingRequests && soundEnabled) {
      // Play immediately
      playNotificationSound();
      
      // Set up 5-minute interval
      intervalRef.current = setInterval(() => {
        if (hasPendingRef.current && soundEnabled) {
          playNotificationSound();
        }
      }, 5 * 60 * 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasPendingRequests, soundEnabled, playNotificationSound]);

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

  return { playNotificationSound, soundEnabled, enableSound, disableSound };
};
