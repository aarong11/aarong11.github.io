// src/audio/AudioManager.ts
import { BaseInstrument } from './instruments/BaseInstrument';
import { SineInstrument } from './instruments/implementation/SineInstrument';
import { SawInstrument } from './instruments/implementation/SawInstrument';
import { SamplerInstrument } from './instruments/implementation/SamplerInstrument';

export class AudioManager {
  private static instance: AudioManager;
  public audioContext: AudioContext;
  private instruments: Map<string, BaseInstrument>;
  private analyser: AnalyserNode;
  private masterGain: GainNode;

  // Static registry for instrument constructors.
  private static registry = new Map<string, new () => BaseInstrument>();

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

  // Method to register an instrument.
  public static registerInstrument(key: string, ctor: new () => BaseInstrument) {
    AudioManager.registry.set(key, ctor);
  }

  // Factory method.
  public static createInstrument(key: string): BaseInstrument | undefined {
    const InstrumentCtor = AudioManager.registry.get(key);
    return InstrumentCtor ? new InstrumentCtor() : undefined;
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
    this.addInstrument('sampler', new SamplerInstrument());
    this.addInstrument('sine', new SineInstrument());
    this.addInstrument('saw', new SawInstrument());
  }

  public getInstrumentNames(): string[] {
    return Array.from(this.instruments.keys());
  }

  public createOscillator(frequency: number, audioContext: AudioContext): OscillatorNode {
    const oscillator = audioContext.createOscillator();
    oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
    return oscillator;
  }
}

export default AudioManager;
