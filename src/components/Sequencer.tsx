import React, { useState } from 'react';
import TrackList from './TrackList';
import NoteGrid from './NoteGrid';
import TransportControls from './TransportControls';
import InstrumentSelector from './InstrumentSelector';
import AudioManager from '../audio/AudioManager';
import { useSequencer } from '../hooks/useSequencer';

export const TOTAL_NOTES = 20;
export const INITIAL_COLUMNS = 32;
const BEATS_PER_BAR = 4;
const CELL_WIDTH_PX = 28;
const GRID_LEFT_MARGIN_PX = 5;

function Sequencer() {
  const createEmptyGrid = (): boolean[][] =>
    Array.from({ length: TOTAL_NOTES }, () => Array(INITIAL_COLUMNS).fill(false));

  const numberOfTracks = 5;
  // Each track has its own grid of notes.
  const [tracks, setTracks] = useState<boolean[][][]>(
    Array.from({ length: numberOfTracks }, createEmptyGrid)
  );

  // Current track selection for single‐track view
  const [currentTrack, setCurrentTrack] = useState<number>(0);

  // Show all tracks at once or not
  const [showAll, setShowAll] = useState<boolean>(false);

  // Colors & mutes for each track
  const [trackColours, setTrackColours] = useState<string[]>([
    '#FF5733',
    '#33FFCE',
    '#335CE8',
    '#8E33FF',
    '#FF33A8',
  ]);
  const [trackMutes, setTrackMutes] = useState<boolean[]>(
    new Array(numberOfTracks).fill(false)
  );

  // Here is the important part: an array of instruments, one per track
  const instrumentNames = AudioManager.getInstance().getInstrumentNames();
  const [trackSynths, setTrackSynths] = useState<string[]>(
    () => new Array(numberOfTracks).fill(instrumentNames[0]) // default to first instrument
  );

  const {
    playing,
    currentStep,
    tempo,
    setTempo,
    metronomeEnabled,
    setMetronomeEnabled,
    handlePlay,
    handleStop,
  } = useSequencer({
    initialTempo: 120,
    initialColumns: INITIAL_COLUMNS,
    tracks,
    trackMutes,
    trackSynths,
    totalNotes: TOTAL_NOTES,
  });

  const updateCurrentTrackGrid = (row: number, col: number) => {
    const updatedTracks = tracks.map((grid, index) => {
      if (index === currentTrack) {
        // Clone the selected track’s grid
        const newGrid = grid.map((rowArr) => [...rowArr]);
        // Toggle the specific cell
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

  const handleColourChange = (trackIndex: number, newColor: string) => {
    const updatedColours = [...trackColours];
    updatedColours[trackIndex] = newColor;
    setTrackColours(updatedColours);
  };

  const bar = Math.floor(currentStep / BEATS_PER_BAR) + 1;
  const beat = (currentStep % BEATS_PER_BAR) + 1;

  return (
    <div className="w-full bg-gray-900 p-4 border border-gray-700 rounded min-w-[280px]">
      <div className="flex items-stretch">
        {/* Left side: track list, mutes, etc. */}
        <div className="w-1/5 bg-black p-4 border-r border-gray-700 flex flex-col">
          <TrackList
            tracks={tracks}
            currentTrack={currentTrack}
            onSelectTrack={setCurrentTrack}
            trackColours={trackColours}
            trackMutes={trackMutes}
            onToggleMute={toggleMute}
          />
        </div>

        {/* Right side: note grid, instrument selector, transport, etc. */}
        <div className="flex-1 bg-black p-4 overflow-x-auto flex flex-col relative min-w-[918px]">
          {/* Instrument selector for the current track */}
          <InstrumentSelector
            selectedInstrument={trackSynths[currentTrack]}
            onChangeInstrument={(newInstName) => {
              setTrackSynths((prev) => {
                const copy = [...prev];
                copy[currentTrack] = newInstName;
                return copy;
              });
            }}
          />

          <div className="text-white mb-2">{`Bar ${bar}, Beat ${beat}`}</div>

          <div className="relative">
            {showAll ? (
              // If "Show All" is true, show all tracks on separate note grids
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
              // Single track view
              <NoteGrid
                grid={tracks[currentTrack]}
                onToggleCell={updateCurrentTrackGrid}
                trackColour={trackColours[currentTrack]}
                instrument={trackSynths[currentTrack]}
              />
            )}
            {/* Red playback line when playing in single‐track view */}
            {playing && !showAll && (
              <div
                className="absolute top-0 bottom-0 bg-red-500 opacity-75 pointer-events-none"
                style={{
                  width: '2px',
                  left:
                    currentStep * CELL_WIDTH_PX +
                    CELL_WIDTH_PX * 2 -
                    GRID_LEFT_MARGIN_PX,
                }}
              />
            )}
          </div>
        </div>
      </div>

      {/* Transport controls at bottom */}
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
