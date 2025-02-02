import React, { useEffect, useState } from 'react';
import AudioManager from '../audio/AudioManager';

function InstrumentSelector() {
  const [instruments, setInstruments] = useState<string[]>([]);

  useEffect(() => {
    const manager = AudioManager.getInstance();
    let instrumentsTest = manager;
    console.log(instrumentsTest);
    setInstruments(manager.getInstrumentNames());
  }, []);

  return (
    <select className="p-2 bg-gray-800 border border-gray-700 rounded text-white">
      {instruments.map((inst) => (
        <option key={inst} value={inst}>{inst}</option>
      ))}
    </select>
  );
}

export default InstrumentSelector;
