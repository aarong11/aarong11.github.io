import React, { useEffect, useState } from 'react';
import AudioManager from '../audio/AudioManager';

interface InstrumentSelectorProps {
  selectedInstrument: string;
  onChangeInstrument: (newInstrument: string) => void;
}

function InstrumentSelector({ selectedInstrument, onChangeInstrument }: InstrumentSelectorProps) {
  const [instruments, setInstruments] = useState<string[]>([]);

  useEffect(() => {
    const manager = AudioManager.getInstance();
    setInstruments(manager.getInstrumentNames());
  }, []);

  return (
    <select
      className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
      value={selectedInstrument}
      onChange={(e) => onChangeInstrument(e.target.value)}
    >
      {instruments.map((inst) => (
        <option key={inst} value={inst}>
          {inst}
        </option>
      ))}
    </select>
  );
}

export default InstrumentSelector;
