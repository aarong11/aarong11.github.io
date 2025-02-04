// src/audio/instruments/MyPianoInstrument.ts
import { BaseInstrument } from '../BaseInstrument';
import { AudioManager } from '../../AudioManager';

export class SawInstrument extends BaseInstrument {
  play(frequency: number, duration: number, audioContext: AudioContext) {
    const playTone = (osc: OscillatorNode) => {
      osc.type = 'sawtooth';
      osc.connect(audioContext.destination);
      osc.start();
    };

    if (duration <= 0) {
      if (this.oscillator) {
        this.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        return;
      }
      this.oscillator = AudioManager.getInstance().createOscillator(frequency, audioContext);
      playTone(this.oscillator);
    } else {
      const osc = AudioManager.getInstance().createOscillator(frequency, audioContext);
      playTone(osc);
      osc.stop(audioContext.currentTime + duration);
    }
  }

  stop(audioContext: AudioContext) {
    super.stop(audioContext);
  }
}