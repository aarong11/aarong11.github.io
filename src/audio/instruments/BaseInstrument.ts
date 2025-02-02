export abstract class BaseInstrument {
  protected oscillator: OscillatorNode | null = null;

  // Static registry for instrument constructors.
  private static registry = new Map<string, new () => BaseInstrument>();

  // Method to register an instrument.
  public static registerInstrument(key: string, ctor: new () => BaseInstrument) {
    BaseInstrument.registry.set(key, ctor);
  }

  // Factory method.
  public static createInstrument(key: string): BaseInstrument | undefined {
    const InstrumentCtor = BaseInstrument.registry.get(key);
    return InstrumentCtor ? new InstrumentCtor() : undefined;
  }

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

  protected createOscillator(frequency: number, audioContext: AudioContext): OscillatorNode {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    return oscillator;
  }
}
