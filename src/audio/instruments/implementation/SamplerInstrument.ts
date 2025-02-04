// ...existing code...
import { BaseInstrument } from '../BaseInstrument';
import { AudioManager } from '../../AudioManager';

export class SamplerInstrument extends BaseInstrument {
  private sampleBuffer: AudioBuffer | null = null;
  private source: AudioBufferSourceNode | null = null;
  private readonly BASE_FREQUENCY = 32.7; // Approx C1

  constructor() {
    super();
    this.loadSample('/samples/piano/C1.mp3');
  }

  private async loadSample(url: string) {
    const audioContext = AudioManager.getInstance().audioContext;
    try {
      const response = await fetch(url);
      const arrayBuffer = await response.arrayBuffer();
      this.sampleBuffer = await audioContext.decodeAudioData(arrayBuffer);
    } catch (error) {
      console.error(`Error loading sample: ${error}`);
    }
  }

  play(frequency: number, duration: number, audioContext: AudioContext) {
    if (!this.sampleBuffer) {
      console.warn('Sample buffer not loaded yet.');
      return;
    }

    // If we already have an indefinite source, just adjust playback rate
    if (duration <= 0 && this.source) {
      this.source.playbackRate.value = frequency / this.BASE_FREQUENCY;
      return;
    }

    // Otherwise create a new source
    this.source = audioContext.createBufferSource();
    this.source.buffer = this.sampleBuffer;
    this.source.playbackRate.value = frequency / this.BASE_FREQUENCY;
    this.source.connect(audioContext.destination);
    this.source.start();

    if (duration > 0) {
      this.source.stop(audioContext.currentTime + duration);
    }
  }

  stop(audioContext: AudioContext) {
    if (this.source) {
      this.source.stop();
      this.source.disconnect();
      this.source = null;
    }
  }
}
