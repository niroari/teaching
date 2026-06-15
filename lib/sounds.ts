// Web Audio API Synthesizer for Sentence Auction Sound Effects
// Ensures all audio works offline and has zero external dependencies.

class SoundSystem {
  private ctx: AudioContext | null = null;
  private enabled: boolean = true;

  private init() {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    // Resume context if suspended (common browser security behavior)
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
    return this.ctx;
  }

  toggle(state?: boolean) {
    if (state !== undefined) {
      this.enabled = state;
    } else {
      this.enabled = !this.enabled;
    }
    return this.enabled;
  }

  isEnabled() {
    return this.enabled;
  }

  // Play a simple clock tick
  playTick() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(600, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

    osc.start();
    osc.stop(ctx.currentTime + 0.05);
  }

  // Play a dramatic gong/gavel sound
  playGavel() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    // We synthesize a heavy wood gavel hit (gong-like frequency blend)
    const duration = 1.0;
    
    // Fundamental frequency
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    // Gavel knock frequency
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(120, ctx.currentTime);
    osc1.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.2);

    // Metallic ring overlay
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(350, ctx.currentTime);
    osc2.frequency.exponentialRampToValueAtTime(100, ctx.currentTime + 0.4);

    gainNode.gain.setValueAtTime(0.8, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  }

  // Play success sound
  playSuccess() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const now = ctx.currentTime;
    const notes = [261.63, 329.63, 392.00, 523.25]; // C4, E4, G4, C5 (major arpeggio)
    
    notes.forEach((freq, index) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now + index * 0.1);
      
      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.2, now + index * 0.1 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, now + index * 0.1 + 0.4);
      
      osc.start(now + index * 0.1);
      osc.stop(now + index * 0.1 + 0.45);
    });
  }

  // Play failure sound
  playBuzzer() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const duration = 0.5;
    const osc1 = ctx.createOscillator();
    const osc2 = ctx.createOscillator();
    const gainNode = ctx.createGain();

    osc1.connect(gainNode);
    osc2.connect(gainNode);
    gainNode.connect(ctx.destination);

    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(120, ctx.currentTime);
    
    osc2.type = 'sawtooth';
    osc2.frequency.setValueAtTime(118, ctx.currentTime); // detuned for dirty buzzer sound

    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc1.start();
    osc2.start();
    osc1.stop(ctx.currentTime + duration);
    osc2.stop(ctx.currentTime + duration);
  }

  // Play a celebratory cheer sound
  playCheer() {
    if (!this.enabled) return;
    const ctx = this.init();
    if (!ctx) return;

    const duration = 2.0;
    const now = ctx.currentTime;
    
    // Synthesize noise (white noise source) for crowd cheer
    const bufferSize = ctx.sampleRate * duration;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    
    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }
    
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    
    // Filter noise to sound like crowd cheering
    const filter = ctx.createBiquadFilter();
    filter.type = 'bandpass';
    filter.frequency.value = 1000;
    filter.Q.value = 1.0;
    
    // Animate filter frequency for dynamic cheer
    filter.frequency.setValueAtTime(800, now);
    filter.frequency.exponentialRampToValueAtTime(2000, now + 0.5);
    filter.frequency.exponentialRampToValueAtTime(600, now + duration);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.4, now + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
    
    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    
    noise.start(now);
    noise.stop(now + duration);
  }
}

export const sounds = new SoundSystem();
