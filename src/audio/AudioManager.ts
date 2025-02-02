// src/audio/AudioManager.ts
import { BaseInstrument } from './instruments/BaseInstrument';
import { MyCustomInstrument } from './instruments/implementation/MyCustomInstrument';
import { MyGuitarInstrument } from './instruments/implementation/MyGuitarInstrument';
import { MyPianoInstrument } from './instruments/implementation/MyPianoInstrument';

export class AudioManager {
  private static instance: AudioManager;
  public audioContext: AudioContext;
  private instruments: Map<string, BaseInstrument>;
  private analyser: AnalyserNode;
  private masterGain: GainNode;

  private constructor() {
    this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.instruments = new Map();
    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.masterGain = this.audioContext.createGain();
    this.masterGain.connect(this.analyser);
    this.analyser.connect(this.audioContext.destination);
  }

  public static getInstance(): AudioManager {
    if (!AudioManager.instance) {
      AudioManager.instance = new AudioManager();
      AudioManager.instance.initializeDefaultInstruments();
    }
    return AudioManager.instance;
  }

  public addInstrument(name: string, instrument: BaseInstrument) {
    this.instruments.set(name, instrument);
  }

  public playNote(instrumentName: string, frequency: number, duration: number = 1) {
    const instrument = this.instruments.get(instrumentName);
    if (instrument) {
      instrument.play(frequency, duration, this.audioContext);
    } else {
      console.warn(`Instrument ${instrumentName} not found.`);
    }
  }

  public stopNote(instrumentName?: string) {
    if (instrumentName) {
      const instrument = this.instruments.get(instrumentName);
      if (instrument) {
        instrument.stop(this.audioContext);
      } else {
        console.warn(`Instrument ${instrumentName} not found.`);
      }
    } else {
      this.instruments.forEach((instrument) => instrument.stop(this.audioContext));
    }
  }

  public playClick(duration: number = 0.015, accent: boolean = false) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    const frequency = accent ? 1500 : 1000;
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.connect(gainNode);
    gainNode.connect(this.masterGain);
    gainNode.gain.setValueAtTime(1, this.audioContext.currentTime);
    oscillator.start();
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  public getAnalyser(): AnalyserNode {
    return this.analyser;
  }

  public initializeDefaultInstruments() {
    const piano = BaseInstrument.createInstrument('piano');
    const guitar = BaseInstrument.createInstrument('guitar');
    const custom = BaseInstrument.createInstrument('custom');
    this.addInstrument('piano', new MyPianoInstrument());
    this.addInstrument('guitar', new MyGuitarInstrument());
    this.addInstrument('custom', new MyCustomInstrument());
  }

  public getInstrumentNames(): string[] {
    return Array.from(this.instruments.keys());
  }
}

export default AudioManager;
