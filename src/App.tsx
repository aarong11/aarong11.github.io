// File: src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sequencer from './components/Sequencer';
import MenuBar from './components/MenuBar';
import Visualizer from './components/Visualizer'; 
import './styles/tailwind.css';
import './styles/global.css';

function App() {
  const [visualizerMode, setVisualizerMode] = useState<'waveform' | 'spectrum' | 'radial' | 'particle' | 'tunnel'>('waveform');

  return (
    <Router>
      <div className="w-full h-screen flex flex-col">
        <MenuBar visualizerMode={visualizerMode} setVisualizerMode={setVisualizerMode} />
        {/* Top bar with "Music Studio" */}

        {/* Main content area */}
        <div className="flex flex-grow overflow-hidden">
          {/* Left side for routes */}

          {/* Right side for Sequencer & transport (handled inside Sequencer) */}
          <div className="flex-1 flex flex-col bg-gray-900 p-4">
            <Sequencer />
          </div>

          <div className="w-1/2 border-l border-gray-700 pl-2">
            <Visualizer mode={visualizerMode} />
          </div>

        </div>
      </div>
    </Router>
  );
}

export default App;
