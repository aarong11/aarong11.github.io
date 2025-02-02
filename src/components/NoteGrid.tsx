import React from 'react';
import AudioManager from '../audio/AudioManager';

// For demonstration, 32 piano‐roll rows, and a large number of columns
// (e.g. 64 time steps) to illustrate horizontal scrolling. Adjust as needed.
const TOTAL_NOTES = 20;

// A simple 12‐note pattern for black/white keys:
const PIANO_PATTERN = [
  false, // C
  true,  // C#
  false, // D
  true,  // D#
  false, // E
  false, // F
  true,  // F#
  false, // G
  true,  // G#
  false, // A
  true,  // A#
  false, // B
];

interface NoteGridProps {
  grid: boolean[][];
  onToggleCell: (rowIndex: number, colIndex: number) => void;
  trackColour?: string;
  instrument: string;
}

function NoteGrid({ grid, onToggleCell, trackColour, instrument }: NoteGridProps) {
  const audioManager = AudioManager.getInstance();

  const playNote = (rowIndex: number) => {
    const baseFrequency = 261.63;
    const frequency = baseFrequency * Math.pow(2, rowIndex / 12);
    audioManager.playNote(instrument, frequency, -1); // -1 for indefinite duration
  };

  const stopNote = () => {
    audioManager.stopNote(instrument);
  };

  return (
    <div className="w-full bg-gray-800 border border-gray-700 rounded p-4">
      {grid.slice().reverse().map((row, rowIndex) => {
        const actualRowIndex = TOTAL_NOTES - 1 - rowIndex;
        const isBlack = PIANO_PATTERN[actualRowIndex % 12];

        return (
          <div key={actualRowIndex} className="flex items-center mb-1">
            <div
              className={`w-6 h-6 border ${isBlack ? 'bg-black' : 'bg-white'}`}
              style={{ borderColor: trackColour || '#fff' }}
              onMouseDown={() => playNote(actualRowIndex)}
              onMouseUp={stopNote}
              onMouseLeave={stopNote}
            />

            <div className="flex flex-nowrap overflow-x-auto ml-3 space-x-1">
              {row.map((isActive, colIndex) => (
                <div
                  key={colIndex}
                  onClick={() => onToggleCell(actualRowIndex, colIndex)}
                  className={`w-6 h-6 border border-gray-600 cursor-pointer
                    ${isActive ? 'bg-orange-600' : 'bg-gray-700'} 
                    hover:bg-orange-500 transition-all`}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default NoteGrid;