import React, { useState } from 'react';

interface MenuBarProps {
  visualizerMode: 'waveform' | 'spectrum' | 'radial' | 'particle' | 'tunnel';
  setVisualizerMode: (mode: 'waveform' | 'spectrum' | 'radial' | 'particle' | 'tunnel') => void;
}

function MenuBar({ visualizerMode, setVisualizerMode }: MenuBarProps) {
    const [fileMenuOpen, setFileMenuOpen] = useState(false);
    const [vizMenuOpen, setVizMenuOpen] = useState(false);

    const toggleFileMenu = () => {
        setFileMenuOpen(prev => !prev);
    };

    const toggleVizMenu = () => {
        setVizMenuOpen(prev => !prev);
    };

    const handleExit = () => {
        window.close();
    };

    const modes: Array<{label: string, value: 'waveform' | 'spectrum' | 'radial' | 'particle' | 'tunnel'}> = [
      { label: 'Waveform', value: 'waveform' },
      { label: 'Spectrum', value: 'spectrum' },
      { label: 'Radial', value: 'radial' },
      { label: 'Particle', value: 'particle' },
      { label: 'Tunnel', value: 'tunnel' },
    ];

    return (
        <div>
            <nav className="bg-gray-800 text-white px-4 py-2 border-b border-gray-700 relative z-50">
                <ul className="flex space-x-6">
                    <li 
                        className="cursor-pointer hover:underline relative"
                        onClick={toggleFileMenu}
                    >
                        File
                        {fileMenuOpen && (
                            <ul className="absolute bg-gray-800 text-white mt-2 py-2 w-32 border border-gray-700">
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Save</li>
                                <li className="px-4 py-2 hover:bg-gray-700 cursor-pointer">Open</li>
                                <li 
                                    className="px-4 py-2 hover:bg-gray-700 cursor-pointer"
                                    onClick={handleExit}
                                >
                                    Exit
                                </li>
                            </ul>
                        )}
                    </li>
                    <li className="cursor-pointer hover:underline">Edit</li>
                    <li className="cursor-pointer hover:underline">View</li>
                    <li className="cursor-pointer hover:underline">Window</li>
                    <li
                      className="cursor-pointer hover:underline relative"
                      onClick={toggleVizMenu}
                    >
                      Visualizer
                      {vizMenuOpen && (
                        <ul className="absolute bg-gray-800 text-white mt-2 py-2 w-40 border border-gray-700">
                          {modes.map(modeOpt => (
                            <li
                              key={modeOpt.value}
                              className={`px-4 py-2 hover:bg-gray-700 cursor-pointer ${visualizerMode === modeOpt.value ? 'bg-gray-700' : ''}`}
                              onClick={() => { setVisualizerMode(modeOpt.value); setVizMenuOpen(false); }}
                            >
                              {modeOpt.label}
                            </li>
                          ))}
                        </ul>
                      )}
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default MenuBar;
