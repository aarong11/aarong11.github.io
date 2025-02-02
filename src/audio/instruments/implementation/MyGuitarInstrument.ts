// src/audio/instruments/MyGuitarInstrument.ts
import { BaseInstrument } from '../BaseInstrument';

export class MyGuitarInstrument extends BaseInstrument {
  play(frequency: number, duration: number, audioContext: AudioContext) {
    const playTone = (osc: OscillatorNode) => {
      osc.type = 'triangle';
      osc.connect(audioContext.destination);
      osc.start();
    };

    if (duration <= 0) {
      if (this.oscillator) {
        this.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        return;
      }
      this.oscillator = this.createOscillator(frequency, audioContext);
      playTone(this.oscillator);
    } else {
      const osc = this.createOscillator(frequency, audioContext);
      playTone(osc);
      osc.stop(audioContext.currentTime + duration);
    }
  }

  stop(audioContext: AudioContext) {
    super.stop(audioContext);
  }
}

BaseInstrument.registerInstrument('piano', MyGuitarInstrument);