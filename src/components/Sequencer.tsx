import React, { useState, useEffect } from 'react';
import TrackList from './TrackList';
import NoteGrid from './NoteGrid';
import TransportControls from './TransportControls';
import AudioManager from '../audio/AudioManager';
import InstrumentSelector from './InstrumentSelector';

export const TOTAL_NOTES = 20;
export const INITIAL_COLUMNS = 32;
const BEATS_PER_BAR = 4;
const CELL_WIDTH_PX = 28;
const GRID_LEFT_MARGIN_PX = 5;

function Sequencer() {
  const createEmptyGrid = (): boolean[][] =>
    Array.from({ length: TOTAL_NOTES }, () => Array(INITIAL_COLUMNS).fill(false));

  const numberOfTracks = 5;
  const [tracks, setTracks] = useState<boolean[][][]>(Array.from({ length: numberOfTracks }, createEmptyGrid));
  const [currentTrack, setCurrentTrack] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [tempo, setTempo] = useState<number>(120);
  const [metronomeEnabled, setMetronomeEnabled] = useState<boolean>(false);
  const [showAll, setShowAll] = useState<boolean>(false);
  const [trackColours, setTrackColours] = useState<string[]>(['#FF5733', '#33FFCE', '#335CE8', '#8E33FF', '#FF33A8']);
  const [trackMutes, setTrackMutes] = useState<boolean[]>(new Array(numberOfTracks).fill(false));
  const [trackSynths] = useState<string[]>(['piano', 'guitar', 'custom']);

  const updateCurrentTrackGrid = (row: number, col: number) => {
    const updatedTracks = tracks.map((grid, index) => {
      if (index === currentTrack) {
        const newGrid = grid.map(rowArr => [...rowArr]);
        newGrid[row][col] = !newGrid[row][col];
        return newGrid;
      }
      return grid;
    });
    setTracks(updatedTracks);
  };

  const toggleMute = (trackIndex: number) => {
    const updated = [...trackMutes];
    updated[trackIndex] = !updated[trackIndex];
    setTrackMutes(updated);
  };

  useEffect(() => {
    if (playing && metronomeEnabled) {
      const accent = currentStep % 4 === 0;
      AudioManager.getInstance().playClick(0.035, accent);
    }
  }, [currentStep, playing, metronomeEnabled]);

  useEffect(() => {
    if (!playing) return;
    const beatDuration = 60000 / tempo;
    const interval = setInterval(() => {
      setCurrentStep(prev => (prev + 1) % INITIAL_COLUMNS);
    }, beatDuration);
    return () => clearInterval(interval);
  }, [playing, tempo]);

  useEffect(() => {
    if (!playing) return;
    const beatDurationSec = (60000 / tempo) / 1000;
    tracks.forEach((grid, trackIndex) => {
      if (!trackMutes[trackIndex]) {
        grid.forEach((row, noteIndex) => {
          if (row[currentStep]) {
            const baseFrequency = 261.63;
            const frequency = baseFrequency * Math.pow(2, noteIndex / 12);
            AudioManager.getInstance().playNote(trackSynths[trackIndex], frequency, beatDurationSec);
          }
        });
      }
    });
  }, [currentStep, playing, tempo, tracks, trackMutes, trackSynths]);

  const handleColourChange = (trackIndex: number, newColor: string) => {
    const updatedColours = [...trackColours];
    updatedColours[trackIndex] = newColor;
    setTrackColours(updatedColours);
  };

  const handlePlay = () => {
    setPlaying(true);
  };

  const handleStop = () => {
    setPlaying(false);
    setCurrentStep(0);
  };

  const bar = Math.floor(currentStep / BEATS_PER_BAR) + 1;
  const beat = (currentStep % BEATS_PER_BAR) + 1;

  return (
    <div className="w-full bg-gray-900 p-4 border border-gray-700 rounded min-w-[280px]">
      <div className="flex items-stretch">
        <div className="w-1/5 bg-black p-4 border-r border-gray-700 flex flex-col">
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            onSelectTrack={setCurrentTrack}
            trackColours={trackColours}
            trackMutes={trackMutes}
            onToggleMute={toggleMute}
          />

          {/* Color Customisation UI */}


        </div>

        <div className="flex-1 bg-black p-4 overflow-x-auto flex flex-col relative min-w-[918px]">
          {/* Instrument Selector */}
          <InstrumentSelector />
          <div className="text-white mb-2">
            {`Bar ${bar}, Beat ${beat}`}
          </div>
          <div className="relative">
            {showAll ? (
              // If "Show All", render grids for every track.
              tracks.map((grid, index) => (
                <div key={index} className="mb-4">
                  <h5 className="text-white mb-1">{`Track ${index + 1}`}</h5>
                  <NoteGrid
                    grid={grid}
                    onToggleCell={updateCurrentTrackGrid}
                    trackColour={trackColours[index]}
                    instrument={trackSynths[index]}
                  />
                </div>
              ))
            ) : (
              // Single track view.
              <NoteGrid
                grid={tracks[currentTrack]}
                onToggleCell={updateCurrentTrackGrid}
                trackColour={trackColours[currentTrack]}
                instrument={trackSynths[currentTrack]}
              />
            )}
            {playing && !showAll && (
              <div
                className="absolute top-0 bottom-0 bg-red-500 opacity-75 pointer-events-none"
                style={{
                  width: '2px',
                  left:  (currentStep * CELL_WIDTH_PX) + (CELL_WIDTH_PX * 2) - GRID_LEFT_MARGIN_PX,
                }}
              />
            )}
          </div>
        </div>
      </div>
      <div className="mt-4">
        <TransportControls
          onPlay={handlePlay}
          onStop={handleStop}
          tempo={tempo}
          onTempoChange={setTempo}
          metronomeEnabled={metronomeEnabled}
          onMetronomeToggle={setMetronomeEnabled}
        />
      </div>
    </div>
  );
}

export default Sequencer;
