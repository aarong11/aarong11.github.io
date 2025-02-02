// src/audio/instruments/MyCustomInstrument.ts
import { BaseInstrument } from '../BaseInstrument';

export class MyCustomInstrument extends BaseInstrument {
  play(frequency: number, duration: number, audioContext: AudioContext) {
    if (duration <= 0) {
      // For sustained notes, check if one is already playing.
      if (this.oscillator) {
        // If already playing, update the frequency.
        this.oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        return;
      }
      // Create and store the oscillator.
      this.oscillator = this.createOscillator(frequency, audioContext);
      this.oscillator.type = 'sawtooth'; // For example, choose a timbre.
      this.oscillator.connect(audioContext.destination);
      this.oscillator.start();
    } else {
      // For transient notes, create a temporary oscillator.
      const osc = this.createOscillator(frequency, audioContext);
      osc.type = 'sawtooth';
      osc.connect(audioContext.destination);
      osc.start();
      osc.stop(audioContext.currentTime + duration);
    }
  }

  stop(audioContext: AudioContext) {
    // Use the BaseInstrument’s stop() method.
    super.stop(audioContext);
  }
}

// Register the custom instrument.
BaseInstrument.registerInstrument('custom', MyCustomInstrument);
