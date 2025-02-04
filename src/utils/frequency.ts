// src/utils/frequency.ts
export function getFrequencyFromNote(baseFreq: number, semitoneOffset: number): number {
    // Default base frequency can be A4=440 or C4=261.63. This example uses 261.63 as a default.
    return baseFreq * Math.pow(2, semitoneOffset / 12);
}
  