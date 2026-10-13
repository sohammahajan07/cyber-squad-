// Realistic Audio Engine for Krishi Bandhu Farmer Video & Presentation
// Features:
// 1. Natural Hindi & Indian Voice Selector (Google hi-IN, Microsoft Natural Hindi, etc.)
// 2. Realistic Indian Acoustic Ambient Scoring (gentle tanpura/flute harmonic chords via Web Audio API)
// 3. Audio preview & synchronization

class RealisticAudioEngine {
  private audioCtx: AudioContext | null = null;
  private bgGainNode: GainNode | null = null;
  private oscillators: OscillatorNode[] = [];
  private isAmbientPlaying: boolean = false;
  private voicesLoaded: boolean = false;
  private availableVoices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined') {
      this.initVoices();
    }
  }

  private initVoices() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    
    const loadVoices = () => {
      this.availableVoices = window.speechSynthesis.getVoices();
      this.voicesLoaded = this.availableVoices.length > 0;
    };

    loadVoices();
    if (window.speechSynthesis.onvoiceschanged !== undefined) {
      window.speechSynthesis.onvoiceschanged = loadVoices;
    }
  }

  /**
   * Finds the most natural, realistic Hindi voice available on the device
   */
  public getBestHindiVoice(): SpeechSynthesisVoice | null {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis.getVoices();

    // Priority 1: High-fidelity natural online Indian Hindi voices
    const naturalHindi = voices.find(
      (v) =>
        (v.lang.includes('hi') || v.lang.includes('HI')) &&
        (v.name.includes('Natural') || v.name.includes('Online') || v.name.includes('Google') || v.name.includes('Swara') || v.name.includes('Madhur'))
    );
    if (naturalHindi) return naturalHindi;

    // Priority 2: Any hi-IN voice
    const anyHindi = voices.find((v) => v.lang.toLowerCase().replace('_', '-').includes('hi-in') || v.lang.startsWith('hi'));
    if (anyHindi) return anyHindi;

    // Priority 3: Indian English voice with natural Indian accent as fallback
    const indianEnglish = voices.find((v) => v.lang.toLowerCase().includes('en-in') || v.name.includes('India'));
    if (indianEnglish) return indianEnglish;

    return null;
  }

  public getBestVoiceForLang(lang: 'en' | 'hi' | 'mr'): SpeechSynthesisVoice | null {
    if (lang === 'hi') return this.getBestHindiVoice();
    
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    const voices = this.availableVoices.length > 0 ? this.availableVoices : window.speechSynthesis.getVoices();

    if (lang === 'mr') {
      const mrVoice = voices.find((v) => v.lang.includes('mr') || v.lang.includes('MR'));
      if (mrVoice) return mrVoice;
      return this.getBestHindiVoice(); // Hindi voice speaks Marathi clearly with similar Devanagari phonetics
    }

    // English (Indian accent preferred)
    const enVoice = voices.find(
      (v) =>
        v.lang.includes('en-IN') ||
        v.name.includes('India') ||
        v.name.includes('Google UK') ||
        v.lang.includes('en-GB')
    );
    return enVoice || voices.find((v) => v.lang.startsWith('en')) || null;
  }

  /**
   * Speaks narration text with realistic cadence, natural pitch, and pacing
   */
  public speakNarration(
    text: string,
    lang: 'en' | 'hi' | 'mr' = 'hi',
    rate: number = 1.0,
    onStart?: () => void,
    onEnd?: () => void,
    onError?: () => void
  ) {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    window.speechSynthesis.cancel();

    // Clean up text for natural breathing pauses
    const formattedText = text
      .replace(/₹/g, ' रुपये ')
      .replace(/%/g, ' प्रतिशत ')
      .replace(/\+/g, ' प्लस ')
      .replace(/\//g, ' प्रति ');

    const utterance = new SpeechSynthesisUtterance(formattedText);
    
    // Choose optimal rate and pitch for authentic Indian speech cadence
    utterance.rate = Math.max(0.85, Math.min(1.2, rate * 0.95)); // Slightly relaxed speed for clear understanding
    utterance.pitch = lang === 'hi' ? 1.02 : 1.0;

    const voice = this.getBestVoiceForLang(lang);
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = lang === 'hi' ? 'hi-IN' : lang === 'mr' ? 'mr-IN' : 'en-IN';
    }

    if (onStart) utterance.onstart = onStart;
    if (onEnd) utterance.onend = onEnd;
    if (onError) utterance.onerror = onError;

    try {
      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech synthesis trigger failed:', e);
      if (onError) onError();
    }
  }

  public stopSpeaking() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }

  /**
   * Starts gentle acoustic Indian ambient score (warm Tanpura drone harmonics in C# / D#)
   * Plays softly at 3-5% volume to provide realistic documentary atmosphere
   */
  public startAmbientAgritechScore() {
    if (this.isAmbientPlaying) return;

    try {
      const AudioCtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtxClass) return;

      if (!this.audioCtx) {
        this.audioCtx = new AudioCtxClass();
      }

      if (this.audioCtx.state === 'suspended') {
        this.audioCtx.resume();
      }

      this.bgGainNode = this.audioCtx.createGain();
      // Very gentle background level
      this.bgGainNode.gain.setValueAtTime(0.035, this.audioCtx.currentTime);
      this.bgGainNode.connect(this.audioCtx.destination);

      // Warm Tanpura harmonic frequencies (Sa: 138.59 Hz, Pa: 207.65 Hz, Sa high: 277.18 Hz)
      const droneFreqs = [138.59, 207.65, 277.18, 415.3];
      this.oscillators = droneFreqs.map((freq, i) => {
        const osc = this.audioCtx!.createOscillator();
        osc.type = i % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.audioCtx!.currentTime);

        // Add subtle detune for warm chorus effect
        osc.detune.setValueAtTime((i - 1.5) * 4, this.audioCtx!.currentTime);

        const oscGain = this.audioCtx!.createGain();
        oscGain.gain.setValueAtTime(0.25, this.audioCtx!.currentTime);
        osc.connect(oscGain);
        oscGain.connect(this.bgGainNode!);

        osc.start();
        return osc;
      });

      this.isAmbientPlaying = true;
    } catch (err) {
      console.warn('Ambient audio could not start:', err);
    }
  }

  public stopAmbientAgritechScore() {
    try {
      this.oscillators.forEach((osc) => {
        try { osc.stop(); osc.disconnect(); } catch (_) {}
      });
      this.oscillators = [];
      this.isAmbientPlaying = false;
    } catch (err) {
      console.warn('Ambient audio stop error:', err);
    }
  }

  public isAmbientActive(): boolean {
    return this.isAmbientPlaying;
  }
}

export const realisticAudio = new RealisticAudioEngine();
