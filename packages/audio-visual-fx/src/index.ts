import { SoundEffectType, VisualEffectType } from '@aep/types';

/**
 * Web Audio Synthesizer & Custom MP3 Audio FX Manager for AEP
 */
export class SoundFXManager {
  private audioCtx: AudioContext | null = null;
  private customSoundUrls: Map<SoundEffectType, string> = new Map();

  constructor() {
    this.loadCustomSoundsFromStorage();
  }

  private loadCustomSoundsFromStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const stored = localStorage.getItem('aep_custom_sounds');
        if (stored) {
          const parsed = JSON.parse(stored);
          Object.keys(parsed).forEach((key) => {
            this.customSoundUrls.set(key as SoundEffectType, parsed[key]);
          });
        }
      } catch (e) {
        console.warn('Failed to load custom sounds:', e);
      }
    }
  }

  private saveCustomSoundsToStorage() {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const obj: Record<string, string> = {};
        this.customSoundUrls.forEach((url, key) => {
          obj[key] = url;
        });
        localStorage.setItem('aep_custom_sounds', JSON.stringify(obj));
      } catch (e) {
        console.warn('Failed to save custom sounds:', e);
      }
    }
  }

  /**
   * Set custom MP3 file URL or Base64 data for a specific sound effect
   */
  public setCustomSoundUrl(type: SoundEffectType, url: string) {
    if (url) {
      this.customSoundUrls.set(type, url);
    } else {
      this.customSoundUrls.delete(type);
    }
    this.saveCustomSoundsToStorage();
  }

  /**
   * Get current custom MP3 URL for a sound effect if available
   */
  public getCustomSoundUrl(type: SoundEffectType): string | undefined {
    return this.customSoundUrls.get(type);
  }

  /**
   * Clear custom MP3 URL for a sound effect (reset to default synthesized Web Audio)
   */
  public clearCustomSound(type: SoundEffectType) {
    this.customSoundUrls.delete(type);
    this.saveCustomSoundsToStorage();
  }

  private initContext() {
    if (!this.audioCtx && typeof window !== 'undefined') {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        this.audioCtx = new AudioContextClass();
      }
    }
    if (this.audioCtx && this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  /**
   * Play sound effect (Plays uploaded custom MP3 file if present, else fallback to Web Audio Synthesizer)
   */
  public play(type: SoundEffectType, volume: number = 0.8) {
    const customUrl = this.customSoundUrls.get(type);

    if (customUrl && typeof window !== 'undefined') {
      try {
        const audio = new Audio(customUrl);
        audio.volume = Math.min(1, Math.max(0, volume));
        audio.play().catch(err => {
          console.warn('Custom MP3 play failed, falling back to Web Audio:', err);
          this.playSynthesizedSound(type, volume);
        });
        return;
      } catch (e) {
        console.warn('Error playing custom sound:', e);
      }
    }

    this.playSynthesizedSound(type, volume);
  }

  private playSynthesizedSound(type: SoundEffectType, volume: number = 0.8) {
    try {
      this.initContext();
      if (!this.audioCtx) return;

      const now = this.audioCtx.currentTime;

      switch (type) {
        case 'round_start': {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(440, now);
          osc.frequency.exponentialRampToValueAtTime(880, now + 0.3);
          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case 'countdown_tick': {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(800, now);
          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'time_up': {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(300, now);
          osc.frequency.linearRampToValueAtTime(150, now + 0.5);
          gain.gain.setValueAtTime(volume * 0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.5);
          break;
        }

        case 'correct_answer': {
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();

          osc1.type = 'sine';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(523.25, now);
          osc2.frequency.setValueAtTime(659.25, now + 0.15);

          gain.gain.setValueAtTime(volume, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.6);

          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.audioCtx.destination);

          osc1.start(now);
          osc1.stop(now + 0.2);
          osc2.start(now + 0.15);
          osc2.stop(now + 0.6);
          break;
        }

        case 'wrong_answer': {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(130, now);
          gain.gain.setValueAtTime(volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.4);
          break;
        }

        case 'winner_announcement':
        case 'show_end': {
          [523.25, 659.25, 783.99, 1046.5].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.1);
            gain.gain.setValueAtTime(volume, now + idx * 0.1);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.1 + 0.8);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + idx * 0.1);
            osc.stop(now + idx * 0.1 + 0.8);
          });
          break;
        }

        case 'score_update':
        case 'lock_click': {
          // Sharp metallic lock click
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1200, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.08);
          gain.gain.setValueAtTime(volume * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.08);
          break;
        }

        case 'lock_clack': {
          // Heavy mechanical bolt latch
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc1.type = 'square';
          osc2.type = 'triangle';
          osc1.frequency.setValueAtTime(220, now);
          osc2.frequency.setValueAtTime(110, now + 0.04);
          gain.gain.setValueAtTime(volume * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc1.start(now);
          osc2.start(now + 0.04);
          osc1.stop(now + 0.18);
          osc2.stop(now + 0.18);
          break;
        }

        case 'digit_reveal': {
          // High-tech electronic laser reveal chime
          [880, 1320, 1760].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);
            gain.gain.setValueAtTime(volume * 0.5, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.05 + 0.25);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.25);
          });
          break;
        }

        case 'security_alarm': {
          // Urgent security siren sweep
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(600, now);
          osc.frequency.linearRampToValueAtTime(950, now + 0.2);
          osc.frequency.linearRampToValueAtTime(600, now + 0.4);
          gain.gain.setValueAtTime(volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.45);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.45);
          break;
        }

        case 'lockdown': {
          // Deep industrial klaxon horn
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'square';
          osc1.frequency.setValueAtTime(160, now);
          osc2.frequency.setValueAtTime(164, now); // subtle detune beat
          gain.gain.setValueAtTime(volume * 0.9, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.8);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.8);
          osc2.stop(now + 0.8);
          break;
        }

        case 'pin_error': {
          // Double buzzer rejection
          [0, 0.12].forEach((offset) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(140, now + offset);
            gain.gain.setValueAtTime(volume * 0.8, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.01, now + offset + 0.1);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.1);
          });
          break;
        }

        case 'vault_open': {
          // Cinematic vault opening sound: heavy motor rumble + rising triumphant chords
          const oscBass = this.audioCtx.createOscillator();
          const gainBass = this.audioCtx.createGain();
          oscBass.type = 'sawtooth';
          oscBass.frequency.setValueAtTime(70, now);
          oscBass.frequency.linearRampToValueAtTime(140, now + 1.2);
          gainBass.gain.setValueAtTime(volume * 0.8, now);
          gainBass.gain.exponentialRampToValueAtTime(0.01, now + 1.5);
          oscBass.connect(gainBass);
          gainBass.connect(this.audioCtx.destination);
          oscBass.start(now);
          oscBass.stop(now + 1.5);

          [261.63, 329.63, 392.00, 523.25, 659.25, 783.99].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + 0.3 + idx * 0.12);
            gain.gain.setValueAtTime(volume * 0.6, now + 0.3 + idx * 0.12);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3 + idx * 0.12 + 1.2);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + 0.3 + idx * 0.12);
            osc.stop(now + 0.3 + idx * 0.12 + 1.2);
          });
          break;
        }

        case 'gear_rotate': {
          // Ratchet gear clicking
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'square';
          osc.frequency.setValueAtTime(400, now);
          gain.gain.setValueAtTime(volume * 0.3, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.04);
          break;
        }

        case 'bonus_reveal': {
          [523.25, 659.25, 783.99, 1046.5, 1318.5].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);
            gain.gain.setValueAtTime(volume * 0.6, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.7);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.7);
          });
          break;
        }

        case 'bomb_tick': {
          // Sharp rhythmic metallic clock tick
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(800, now);
          osc.frequency.exponentialRampToValueAtTime(300, now + 0.06);
          gain.gain.setValueAtTime(volume * 0.4, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.06);
          break;
        }

        case 'bomb_danger_tick': {
          // Double rapid high-pitched alarm pulse
          [0, 0.07].forEach((offset) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(1200, now + offset);
            osc.frequency.exponentialRampToValueAtTime(600, now + offset + 0.05);
            gain.gain.setValueAtTime(volume * 0.7, now + offset);
            gain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.05);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + offset);
            osc.stop(now + offset + 0.05);
          });
          break;
        }

        case 'bomb_transfer': {
          // High-velocity whoosh / pass projectile sweep
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(250, now);
          osc.frequency.exponentialRampToValueAtTime(900, now + 0.12);
          osc.frequency.exponentialRampToValueAtTime(150, now + 0.28);
          gain.gain.setValueAtTime(volume * 0.6, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.28);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.28);
          break;
        }

        case 'bomb_impact': {
          // Heavy punchy catch / thud
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.exponentialRampToValueAtTime(45, now + 0.18);
          gain.gain.setValueAtTime(volume * 0.85, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.2);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.2);
          break;
        }

        case 'bomb_explosion': {
          // Massive cinematic boom: sub-bass drop + white noise burst + rumble
          const oscSub = this.audioCtx.createOscillator();
          const gainSub = this.audioCtx.createGain();
          oscSub.type = 'sawtooth';
          oscSub.frequency.setValueAtTime(140, now);
          oscSub.frequency.exponentialRampToValueAtTime(28, now + 1.2);
          gainSub.gain.setValueAtTime(volume * 1.0, now);
          gainSub.gain.exponentialRampToValueAtTime(0.001, now + 1.3);
          oscSub.connect(gainSub);
          gainSub.connect(this.audioCtx.destination);
          oscSub.start(now);
          oscSub.stop(now + 1.3);

          // Second oscillator for sizzle rumble
          const oscNoise = this.audioCtx.createOscillator();
          const gainNoise = this.audioCtx.createGain();
          oscNoise.type = 'square';
          oscNoise.frequency.setValueAtTime(90, now);
          oscNoise.frequency.linearRampToValueAtTime(30, now + 0.8);
          gainNoise.gain.setValueAtTime(volume * 0.5, now);
          gainNoise.gain.exponentialRampToValueAtTime(0.001, now + 0.85);
          oscNoise.connect(gainNoise);
          gainNoise.connect(this.audioCtx.destination);
          oscNoise.start(now);
          oscNoise.stop(now + 0.85);
          break;
        }

        case 'bomb_fake_click': {
          // Mechanical dry click followed by pleasant relief chord
          const oscClick = this.audioCtx.createOscillator();
          const gainClick = this.audioCtx.createGain();
          oscClick.type = 'sawtooth';
          oscClick.frequency.setValueAtTime(900, now);
          gainClick.gain.setValueAtTime(volume * 0.5, now);
          gainClick.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
          oscClick.connect(gainClick);
          gainClick.connect(this.audioCtx.destination);
          oscClick.start(now);
          oscClick.stop(now + 0.04);

          // Relief chime
          [523.25, 659.25, 783.99].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + 0.08 + idx * 0.06);
            gain.gain.setValueAtTime(volume * 0.4, now + 0.08 + idx * 0.06);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08 + idx * 0.06 + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + 0.08 + idx * 0.06);
            osc.stop(now + 0.08 + idx * 0.06 + 0.4);
          });
          break;
        }

        case 'shield_protect': {
          // Glass shield barrier deflection chord
          [440, 660, 880, 1100].forEach((freq, idx) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.03);
            gain.gain.setValueAtTime(volume * 0.4, now + idx * 0.03);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.03 + 0.5);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now + idx * 0.03);
            osc.stop(now + idx * 0.03 + 0.5);
          });
          break;
        }

        case 'freeze_tick': {
          // Frost ice crystallization sound
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(1400, now);
          osc.frequency.exponentialRampToValueAtTime(2200, now + 0.25);
          gain.gain.setValueAtTime(volume * 0.45, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.3);
          break;
        }

        case 'doll_turn': {
          // Eerie mechanical doll turn + low resonance scan
          const osc1 = this.audioCtx.createOscillator();
          const osc2 = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc1.type = 'sawtooth';
          osc2.type = 'sine';
          osc1.frequency.setValueAtTime(260, now);
          osc1.frequency.linearRampToValueAtTime(520, now + 0.4);
          osc2.frequency.setValueAtTime(130, now);
          osc2.frequency.linearRampToValueAtTime(260, now + 0.4);
          gain.gain.setValueAtTime(volume * 0.7, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
          osc1.connect(gain);
          osc2.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc1.start(now);
          osc2.start(now);
          osc1.stop(now + 0.5);
          osc2.stop(now + 0.5);
          break;
        }

        case 'danger_reveal': {
          // Shocking dramatic reveal chord with sub-bass drop
          const bass = this.audioCtx.createOscillator();
          const bassGain = this.audioCtx.createGain();
          bass.type = 'sawtooth';
          bass.frequency.setValueAtTime(150, now);
          bass.frequency.exponentialRampToValueAtTime(45, now + 0.6);
          bassGain.gain.setValueAtTime(volume * 0.9, now);
          bassGain.gain.exponentialRampToValueAtTime(0.01, now + 0.7);
          bass.connect(bassGain);
          bassGain.connect(this.audioCtx.destination);
          bass.start(now);
          bass.stop(now + 0.7);

          [784, 988, 1175].forEach((freq) => {
            if (!this.audioCtx) return;
            const osc = this.audioCtx.createOscillator();
            const gain = this.audioCtx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now);
            gain.gain.setValueAtTime(volume * 0.5, now);
            gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
            osc.connect(gain);
            gain.connect(this.audioCtx.destination);
            osc.start(now);
            osc.stop(now + 0.4);
          });
          break;
        }

        case 'elimination_laser': {
          // Sharp zapping red elimination laser discharge
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(1800, now);
          osc.frequency.exponentialRampToValueAtTime(120, now + 0.25);
          gain.gain.setValueAtTime(volume * 0.8, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }

        case 'reveal_question':
        case 'box_open':
        case 'wheel_spin':
        default: {
          const osc = this.audioCtx.createOscillator();
          const gain = this.audioCtx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(600, now);
          gain.gain.setValueAtTime(volume * 0.5, now);
          gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
          osc.connect(gain);
          gain.connect(this.audioCtx.destination);
          osc.start(now);
          osc.stop(now + 0.25);
          break;
        }
      }
    } catch (e) {
      console.warn('Audio FX error:', e);
    }
  }
}

export const soundFX = new SoundFXManager();

/**
 * Visual FX Particle Triggers
 */
export function triggerVisualEffect(type: VisualEffectType, containerId?: string) {
  if (typeof window === 'undefined') return;

  if (type === 'confetti' || type === 'fireworks') {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 pointer-events-none z-50 overflow-hidden';
    const colors = ['#0066FF', '#00F0FF', '#FFD700', '#FF2D55', '#4CD964', '#FFFFFF'];
    
    for (let i = 0; i < 60; i++) {
      const particle = document.createElement('div');
      const color = colors[Math.floor(Math.random() * colors.length)];
      const left = Math.random() * 100;
      const size = Math.random() * 10 + 6;
      const duration = Math.random() * 2 + 1.5;

      particle.style.cssText = `
        position: absolute;
        top: -20px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background-color: ${color};
        border-radius: ${Math.random() > 0.5 ? '50%' : '2px'};
        transform: rotate(${Math.random() * 360}deg);
        animation: confetti-fall ${duration}s ease-out forwards;
      `;
      overlay.appendChild(particle);
    }

    if (!document.getElementById('aep-confetti-styles')) {
      const style = document.createElement('style');
      style.id = 'aep-confetti-styles';
      style.innerHTML = `
        @keyframes confetti-fall {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(105vh) rotate(720deg); opacity: 0; }
        }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(overlay);
    setTimeout(() => {
      overlay.remove();
    }, 3500);
  }
}
