/**
 * Pure Web Audio API Synthesizer for Overthinking Calculator
 * Synthesizes retro computer sounds, realistic panic sounds, sirens, heartbeats,
 * tension risers, and interactive UI feedback without needing external MP3/WAV assets.
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private masterVolume: number = 0.75;
  private heartbeatTimer: number | null = null;
  private heartbeatBpm: number = 75;
  private tensionOsc: OscillatorNode | null = null;
  private tensionGain: GainNode | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("ot_muted");
      if (savedMute !== null) {
        this.isMuted = savedMute === "true";
      }
      const savedVol = localStorage.getItem("ot_volume");
      if (savedVol !== null) {
        const parsed = parseFloat(savedVol);
        if (!isNaN(parsed)) this.masterVolume = Math.max(0, Math.min(1, parsed));
      }
    }
  }

  private initCtx(): AudioContext | null {
    if (typeof window === "undefined") return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public unlock(): void {
    this.initCtx();
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setMuted(muted: boolean): void {
    this.isMuted = muted;
    if (typeof window !== "undefined") {
      localStorage.setItem("ot_muted", String(muted));
    }
    if (muted) {
      this.stopHeartbeat();
      this.stopTensionRiser();
    }
  }

  public toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  public getVolume(): number {
    return this.masterVolume;
  }

  public setVolume(vol: number): void {
    this.masterVolume = Math.max(0, Math.min(1, vol));
    if (typeof window !== "undefined") {
      localStorage.setItem("ot_volume", String(this.masterVolume));
    }
  }

  private getEffectiveGain(relativeGain: number = 1): number {
    if (this.isMuted) return 0;
    return this.masterVolume * relativeGain;
  }

  // ==================== INTRO SOUNDS ====================

  /**
   * Retro BIOS / vintage boot sequence: dual-tone square beep, hard-drive crunch, and ascending confirmation
   */
  public playIntroBoot(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(this.getEffectiveGain(0.28), now);
    master.connect(ctx.destination);

    // Initial low power hum
    const hum = ctx.createOscillator();
    const humGain = ctx.createGain();
    hum.type = "sawtooth";
    hum.frequency.setValueAtTime(60, now);
    hum.frequency.exponentialRampToValueAtTime(120, now + 0.35);
    humGain.gain.setValueAtTime(0.3, now);
    humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);
    hum.connect(humGain);
    humGain.connect(master);
    hum.start(now);
    hum.stop(now + 0.4);

    // BIOS Dual Beeps (classic 80s/90s PC speaker POST beep)
    const beep1 = ctx.createOscillator();
    const beep1Gain = ctx.createGain();
    beep1.type = "square";
    beep1.frequency.setValueAtTime(880, now + 0.3); // A5
    beep1Gain.gain.setValueAtTime(0.35, now + 0.3);
    beep1Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    beep1.connect(beep1Gain);
    beep1Gain.connect(master);
    beep1.start(now + 0.3);
    beep1.stop(now + 0.45);

    const beep2 = ctx.createOscillator();
    const beep2Gain = ctx.createGain();
    beep2.type = "square";
    beep2.frequency.setValueAtTime(1760, now + 0.5); // A6
    beep2Gain.gain.setValueAtTime(0.3, now + 0.5);
    beep2Gain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);
    beep2.connect(beep2Gain);
    beep2Gain.connect(master);
    beep2.start(now + 0.5);
    beep2.stop(now + 0.7);

    // Ascending confirmation chord (system ready)
    const readyNotes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    readyNotes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const g = ctx.createGain();
      const startTime = now + 0.8 + idx * 0.08;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, startTime);
      g.gain.setValueAtTime(0.2, startTime);
      g.gain.exponentialRampToValueAtTime(0.001, startTime + 0.4);
      osc.connect(g);
      g.connect(master);
      osc.start(startTime);
      osc.stop(startTime + 0.4);
    });
  }

  /**
   * Terminal keystroke click sound
   */
  public playKeyClick(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1200 + Math.random() * 600, now);
    osc.frequency.exponentialRampToValueAtTime(200, now + 0.03);

    gain.gain.setValueAtTime(this.getEffectiveGain(0.06), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.035);
  }

  /**
   * Glitch zap sound for paranoid thoughts and distortions
   */
  public playGlitchSound(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const bufferSize = ctx.sampleRate * 0.08;
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.sin(i / 8);
    }

    const noise = ctx.createBufferSource();
    noise.buffer = buffer;

    const filter = ctx.createBiquadFilter();
    filter.type = "bandpass";
    filter.frequency.setValueAtTime(2400, now);
    filter.Q.setValueAtTime(4, now);

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(this.getEffectiveGain(0.2), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

    noise.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);
    noise.start(now);
    noise.stop(now + 0.08);
  }

  // ==================== PANIC SOUNDS (ANALYZING PHASE) ====================

  /**
   * Realistic synthesized racing Heartbeat (lub-dub)
   * BPM ramps up dynamically as overthinking escalates
   */
  public startHeartbeat(initialBpm: number = 75): void {
    if (this.heartbeatTimer !== null) {
      this.stopHeartbeat();
    }
    this.heartbeatBpm = initialBpm;

    const beatLoop = () => {
      if (this.isMuted) return;
      this.playSingleHeartbeat();
      const intervalMs = (60 / this.heartbeatBpm) * 1000;
      this.heartbeatTimer = window.setTimeout(beatLoop, intervalMs);
    };

    beatLoop();
  }

  public setHeartbeatBPM(bpm: number): void {
    this.heartbeatBpm = Math.max(60, Math.min(200, bpm));
  }

  public stopHeartbeat(): void {
    if (this.heartbeatTimer !== null) {
      clearTimeout(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private playSingleHeartbeat(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const master = ctx.createGain();
    master.gain.setValueAtTime(this.getEffectiveGain(0.4), now);
    master.connect(ctx.destination);

    // "Lub" (first beat, lower pitch, slightly longer)
    const osc1 = ctx.createOscillator();
    const g1 = ctx.createGain();
    osc1.type = "sine";
    osc1.frequency.setValueAtTime(65, now);
    osc1.frequency.exponentialRampToValueAtTime(38, now + 0.12);
    g1.gain.setValueAtTime(0.8, now);
    g1.gain.exponentialRampToValueAtTime(0.001, now + 0.13);
    osc1.connect(g1);
    g1.connect(master);
    osc1.start(now);
    osc1.stop(now + 0.14);

    // "Dub" (second beat, slightly higher, crisper)
    const tDub = now + 0.13;
    const osc2 = ctx.createOscillator();
    const g2 = ctx.createGain();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(80, tDub);
    osc2.frequency.exponentialRampToValueAtTime(45, tDub + 0.11);
    g2.gain.setValueAtTime(0.7, tDub);
    g2.gain.exponentialRampToValueAtTime(0.001, tDub + 0.12);
    osc2.connect(g2);
    g2.connect(master);
    osc2.start(tDub);
    osc2.stop(tDub + 0.13);
  }

  /**
   * Dual-tone Emergency Klaxon Siren (Wee-Woo panic alarm)
   */
  public playPanicAlarm(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "sawtooth";

    // Modulate pitch between 960Hz and 680Hz (European emergency siren pattern)
    for (let i = 0; i < 4; i++) {
      const t = now + i * 0.28;
      osc.frequency.setValueAtTime(960, t);
      osc.frequency.setValueAtTime(680, t + 0.14);
    }

    // Lowpass filter to smooth harshness
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(1800, now);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.getEffectiveGain(0.28), now + 0.05);
    gain.gain.setValueAtTime(this.getEffectiveGain(0.28), now + 0.95);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 1.15);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 1.2);
  }

  /**
   * Tension Riser (Escalating frequency sweep simulating mounting dread)
   */
  public startTensionRiser(durationSeconds: number = 4): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    this.stopTensionRiser();

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(90, now);
    osc.frequency.exponentialRampToValueAtTime(950, now + durationSeconds);

    gain.gain.setValueAtTime(0.001, now);
    gain.gain.linearRampToValueAtTime(this.getEffectiveGain(0.18), now + 0.4);
    gain.gain.setValueAtTime(this.getEffectiveGain(0.22), now + durationSeconds - 0.3);
    gain.gain.exponentialRampToValueAtTime(0.001, now + durationSeconds);

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(300, now);
    filter.frequency.exponentialRampToValueAtTime(2500, now + durationSeconds);

    osc.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + durationSeconds);

    this.tensionOsc = osc;
    this.tensionGain = gain;
  }

  public stopTensionRiser(): void {
    if (this.tensionOsc) {
      try {
        this.tensionOsc.stop();
        this.tensionOsc.disconnect();
      } catch {}
      this.tensionOsc = null;
    }
    if (this.tensionGain) {
      try {
        this.tensionGain.disconnect();
      } catch {}
      this.tensionGain = null;
    }
  }

  /**
   * High-pitch Sonar / Radar Sweep Ping
   */
  public playRadarPing(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(1420, now);
    osc.frequency.exponentialRampToValueAtTime(1380, now + 0.4);

    gain.gain.setValueAtTime(this.getEffectiveGain(0.22), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + 0.55);
  }

  /**
   * Geiger Counter click (radiation / paranoia clicks)
   */
  public playGeigerClick(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "square";
    osc.frequency.setValueAtTime(3200 + Math.random() * 800, now);
    gain.gain.setValueAtTime(this.getEffectiveGain(0.12), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.012);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.015);
  }

  /**
   * Emergency Alert Toast tone (harsh double beep)
   */
  public playEmergencyToast(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sawtooth";
    osc.frequency.setValueAtTime(800, now);
    osc.frequency.setValueAtTime(1050, now + 0.08);

    gain.gain.setValueAtTime(this.getEffectiveGain(0.24), now);
    gain.gain.setValueAtTime(0.001, now + 0.07);
    gain.gain.setValueAtTime(this.getEffectiveGain(0.24), now + 0.08);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.22);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }

  /**
   * Dramatic Sub-bass Impact / Slam when results unlock
   */
  public playDramaticslam(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    // Sub-bass drop
    const sub = ctx.createOscillator();
    const subGain = ctx.createGain();
    sub.type = "sine";
    sub.frequency.setValueAtTime(160, now);
    sub.frequency.exponentialRampToValueAtTime(32, now + 0.7);

    subGain.gain.setValueAtTime(this.getEffectiveGain(0.45), now);
    subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.85);

    sub.connect(subGain);
    subGain.connect(ctx.destination);
    sub.start(now);
    sub.stop(now + 0.9);

    // High metal snap
    const snap = ctx.createOscillator();
    const snapGain = ctx.createGain();
    snap.type = "triangle";
    snap.frequency.setValueAtTime(880, now);
    snap.frequency.exponentialRampToValueAtTime(220, now + 0.15);

    snapGain.gain.setValueAtTime(this.getEffectiveGain(0.25), now);
    snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

    snap.connect(snapGain);
    snapGain.connect(ctx.destination);
    snap.start(now);
    snap.stop(now + 0.2);
  }

  // ==================== INTERACTIVE UI SOUNDS ====================

  public playClick(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(600, now);
    osc.frequency.exponentialRampToValueAtTime(180, now + 0.04);

    gain.gain.setValueAtTime(this.getEffectiveGain(0.12), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.045);
  }

  public playChipToggle(isOn: boolean): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const freq = isOn ? 740 : 440;
    osc.frequency.setValueAtTime(freq, now);
    osc.frequency.exponentialRampToValueAtTime(isOn ? 920 : 360, now + 0.06);

    gain.gain.setValueAtTime(this.getEffectiveGain(0.14), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.08);
  }

  public playWheelSpinClick(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "triangle";
    osc.frequency.setValueAtTime(950 + Math.random() * 200, now);
    gain.gain.setValueAtTime(this.getEffectiveGain(0.14), now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.02);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.025);
  }

  public playWheelWin(): void {
    const ctx = this.initCtx();
    if (!ctx || this.isMuted) return;

    const now = ctx.currentTime;
    const notes = [440, 554.37, 659.25, 880]; // A major arpeggio
    notes.forEach((freq, idx) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const t = now + idx * 0.09;
      osc.type = "sine";
      osc.frequency.setValueAtTime(freq, t);
      gain.gain.setValueAtTime(this.getEffectiveGain(0.2), t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.45);
    });
  }
}

export const sound = new SoundEngine();
