// Accessible Audio & Haptic engine optimized for seniors & hearing accessibility

let activeReminderAudioNodes: { stop: () => void } | null = null;

// Create or reuse AudioContext
function getAudioContext(): AudioContext | null {
  try {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return null;
    return new AudioContextClass();
  } catch {
    return null;
  }
}

/**
 * High-volume, rich-harmonic reminder alarm specifically engineered for seniors.
 * - Frequency tuned to 520Hz - 880Hz (cuts through hearing loss presbycusis)
 * - Dual harmonic oscillators (warm bell tone with acoustic penetration)
 * - Dynamics compressor to prevent speaker clipping while maximizing loud audibility
 * - Classic repeating reminder melody: Ding-Dong... Ding-Dong... Ding-Dong!
 */
export function playLoudReminderSound(options?: {
  repeatCount?: number;
  volumeBoost?: number;
  onComplete?: () => void;
}): { stop: () => void } {
  // Stop any currently playing reminder chime
  stopLoudReminderSound();

  const ctx = getAudioContext();
  if (!ctx) {
    return { stop: () => {} };
  }

  // Resume context if suspended by browser autoplay policy
  if (ctx.state === 'suspended') {
    ctx.resume().catch(() => {});
  }

  const volume = Math.min(1.0, options?.volumeBoost ?? 0.85);
  const repeats = options?.repeatCount ?? 3;

  // Compressor node for maximum loudness without distortion
  const compressor = ctx.createDynamicsCompressor();
  compressor.threshold.setValueAtTime(-12, ctx.currentTime);
  compressor.knee.setValueAtTime(4, ctx.currentTime);
  compressor.ratio.setValueAtTime(8, ctx.currentTime);
  compressor.attack.setValueAtTime(0.005, ctx.currentTime);
  compressor.release.setValueAtTime(0.05, ctx.currentTime);
  compressor.connect(ctx.destination);

  // Master gain
  const masterGain = ctx.createGain();
  masterGain.gain.setValueAtTime(volume, ctx.currentTime);
  masterGain.connect(compressor);

  let isStopped = false;
  const timeoutIds: number[] = [];
  const activeOscillators: OscillatorNode[] = [];

  // Play a single resonant, warm bell chime note (Ding or Dong)
  const playChimeNote = (freq: number, startTime: number, duration: number, noteVolume = 1.0) => {
    if (isStopped) return;

    // Fundamental oscillator (warm triangle wave)
    const osc1 = ctx.createOscillator();
    osc1.type = 'triangle';
    osc1.frequency.setValueAtTime(freq, startTime);

    // Harmonic overtone (pure sine wave 1 octave up for bell-like presence)
    const osc2 = ctx.createOscillator();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(freq * 2, startTime);

    // Note gain envelope
    const noteGain = ctx.createGain();
    noteGain.gain.setValueAtTime(0.001, startTime);
    noteGain.gain.exponentialRampToValueAtTime(noteVolume, startTime + 0.02);
    noteGain.gain.exponentialRampToValueAtTime(0.001, startTime + duration);

    osc1.connect(noteGain);
    osc2.connect(noteGain);
    noteGain.connect(masterGain);

    osc1.start(startTime);
    osc2.start(startTime);
    osc1.stop(startTime + duration);
    osc2.stop(startTime + duration);

    activeOscillators.push(osc1, osc2);
  };

  // Schedule classic two-tone reminder chime pair (High Ding -> Low Dong)
  const scheduleReminderChimePair = (pairStartTime: number) => {
    // Ding (Higher pitch ~784 Hz / G5)
    playChimeNote(783.99, pairStartTime, 0.45, 0.85);
    // Dong (Lower pitch ~587 Hz / D5 or ~523 Hz / C5)
    playChimeNote(523.25, pairStartTime + 0.32, 0.7, 0.95);
  };

  const now = ctx.currentTime + 0.05;
  const pairInterval = 1.1; // 1.1s between chime pairs

  for (let i = 0; i < repeats; i++) {
    scheduleReminderChimePair(now + i * pairInterval);
  }

  // Trigger strong senior-friendly tactile vibration pattern
  triggerHaptic([350, 150, 350, 150, 600]);

  // Handle completion timeout
  const totalDuration = repeats * pairInterval + 0.8;
  const completionTimer = window.setTimeout(() => {
    if (!isStopped) {
      options?.onComplete?.();
    }
  }, totalDuration * 1000);
  timeoutIds.push(completionTimer);

  const stop = () => {
    if (isStopped) return;
    isStopped = true;
    timeoutIds.forEach((id) => clearTimeout(id));
    activeOscillators.forEach((osc) => {
      try {
        osc.stop();
        osc.disconnect();
      } catch {
        // ignore already stopped
      }
    });
    try {
      masterGain.gain.setValueAtTime(masterGain.gain.value, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.08);
      setTimeout(() => {
        try {
          masterGain.disconnect();
        } catch {
          // ignore
        }
      }, 100);
    } catch {
      // ignore
    }
    if (activeReminderAudioNodes?.stop === stop) {
      activeReminderAudioNodes = null;
    }
  };

  activeReminderAudioNodes = { stop };
  return { stop };
}

export function stopLoudReminderSound() {
  if (activeReminderAudioNodes) {
    activeReminderAudioNodes.stop();
    activeReminderAudioNodes = null;
  }
}

/**
 * Spoken voice announcement for medicine reminders (Web Speech Synthesis API)
 */
export function speakReminderText(medicineName: string, dose?: string) {
  try {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const text = `Margaret, it is time for your medicine. ${medicineName}${dose ? `, ${dose}` : ''}.`;
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.88; // Slightly slower, measured cadence for clear understanding
      utterance.pitch = 1.0;
      utterance.volume = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  } catch {
    // Ignore speech synthesis errors
  }
}

// Web Audio synthesizer for accessible UI sound feedback
export function playChime(
  type:
    | 'success'
    | 'alert'
    | 'click'
    | 'subtle'
    | 'sos-pulse'
    | 'beep'
    | 'reminder-loud'
    | 'camera-snap' = 'click'
) {
  if (type === 'reminder-loud') {
    playLoudReminderSound({ repeatCount: 2, volumeBoost: 0.85 });
    return;
  }

  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    const now = ctx.currentTime;

    if (type === 'camera-snap') {
      // Shutter click sound
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.08);
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.start(now);
      osc.stop(now + 0.1);
    } else if (type === 'sos-pulse') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, now);
      osc.frequency.setValueAtTime(660, now + 0.12);
      gain.gain.setValueAtTime(0.45, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === 'beep') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(750, now);
      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.start(now);
      osc.stop(now + 0.14);
    } else if (type === 'success') {
      // Cheerful melodic chime: C5 -> E5 -> G5
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.exponentialRampToValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.exponentialRampToValueAtTime(783.99, now + 0.22); // G5
      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
      osc.start(now);
      osc.stop(now + 0.45);
    } else if (type === 'alert') {
      // Clear 2-tone alert chime
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(660, now);
      osc.frequency.setValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      osc.start(now);
      osc.stop(now + 0.35);
    } else if (type === 'subtle') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, now);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.09);
      osc.start(now);
      osc.stop(now + 0.09);
    } else {
      // Click
      osc.type = 'sine';
      osc.frequency.setValueAtTime(480, now);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);
      osc.start(now);
      osc.stop(now + 0.07);
    }
  } catch {
    // Gracefully ignore audio restrictions
  }
}

export function triggerHaptic(durationOrPattern: number | number[] = 50) {
  try {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      navigator.vibrate(durationOrPattern);
    }
  } catch {
    // Ignore unsupported vibration
  }
}
