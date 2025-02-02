import React from 'react';

interface TransportControlsProps {
  onPlay: () => void;
  onStop: () => void;
  tempo: number;
  onTempoChange: (newTempo: number) => void;
  metronomeEnabled: boolean;
  onMetronomeToggle: (enabled: boolean) => void;
}

function TransportControls({
  onPlay,
  onStop,
  tempo,
  onTempoChange,
  metronomeEnabled,
  onMetronomeToggle,
}: TransportControlsProps) {
  return (
    <div className="w-full flex items-center justify-center space-x-4 mb-4 bg-gray-900 p-3 border border-gray-700 rounded">
      <button
        onClick={onPlay}
        className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded font-bold"
      >
        Play
      </button>
      <button
        onClick={onStop}
        className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded"
      >
        Stop
      </button>
      <label className="flex items-center space-x-2 text-sm text-white">
        <span>Tempo:</span>
        <input
          type="number"
          value={tempo}
          onChange={e => onTempoChange(Number(e.target.value))}
          className="w-16 p-1 bg-gray-800 border border-gray-600 rounded text-white"
        />
      </label>
      <label className="flex items-center space-x-2 text-sm text-white">
        <input
          type="checkbox"
          checked={metronomeEnabled}
          onChange={e => onMetronomeToggle(e.target.checked)}
          className="form-checkbox"
        />
        <span>Metronome</span>
      </label>
    </div>
  );
}

export default TransportControls;
