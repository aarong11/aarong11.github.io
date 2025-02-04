export abstract class BaseInstrument {
  protected oscillator: OscillatorNode | null = null;

  // Subclasses must implement how they play a note.
  abstract play(frequency: number, duration: number, audioContext: AudioContext): void;

  // Stop any sustained (indefinite) note.
  stop(audioContext: AudioContext): void {
    if (this.oscillator) {
      this.oscillator.stop();
      this.oscillator.disconnect();
      this.oscillator = null;
    }
  }
}
