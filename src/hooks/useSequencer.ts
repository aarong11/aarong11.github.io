// src/hooks/useSequencer.ts
import { useState, useEffect } from 'react';
import AudioManager from '../audio/AudioManager';
import { getFrequencyFromNote } from '../utils/frequency';

interface UseSequencerProps {
  initialTempo: number;
  initialColumns: number;
  tracks: boolean[][][];    // 3D array [trackIndex][noteIndex][columnIndex]
  trackMutes: boolean[];
  trackSynths: string[];
  totalNotes: number;
}

export function useSequencer({
  initialTempo,
  initialColumns,
  tracks,
  trackMutes,
  trackSynths,
  totalNotes,
}: UseSequencerProps) {
  const [playing, setPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tempo, setTempo] = useState(initialTempo);
  const [metronomeEnabled, setMetronomeEnabled] = useState(false);

  // Trigger notes & metronome each time currentStep updates
  useEffect(() => {
    if (!playing) return;

    // Metronome click if enabled
    if (metronomeEnabled) {
      const accent = currentStep % 4 === 0; // accent on quarter notes
      AudioManager.getInstance().playClick(0.035, accent);
    }

    // Play any active notes on this step
    const beatDurationSec = (60000 / tempo) / 1000; // step duration in seconds

    tracks.forEach((grid, trackIndex) => {
      if (!trackMutes[trackIndex]) {
        grid.forEach((row, noteIndex) => {
          if (row[currentStep]) {
            // For example, baseFreq = 261.63 (middle C)
            const freq = getFrequencyFromNote(261.63, noteIndex);
            AudioManager.getInstance().playNote(trackSynths[trackIndex], freq, beatDurationSec);
          }
        });
      }
    });
  }, [currentStep, playing, metronomeEnabled, tempo, tracks, trackMutes, trackSynths]);

  // Update current step on an interval
  useEffect(() => {
    if (!playing) return;

    const beatDuration = 60000 / tempo; // ms per step
    const intervalId = setInterval(() => {
      setCurrentStep((prev) => (prev + 1) % initialColumns);
    }, beatDuration);

    return () => clearInterval(intervalId);
  }, [playing, tempo, initialColumns]);

  const handlePlay = () => setPlaying(true);

  const handleStop = () => {
    setPlaying(false);
    setCurrentStep(0);
  };

  return {
    playing,
    currentStep,
    tempo,
    setTempo,
    metronomeEnabled,
    setMetronomeEnabled,
    handlePlay,
    handleStop,
  };
}
