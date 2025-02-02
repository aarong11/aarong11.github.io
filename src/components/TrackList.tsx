import React from 'react';
import TrackItem from './TrackItem';

interface TrackListProps {
  tracks: boolean[][][];
  currentTrack: number;
  onSelectTrack: (trackIndex: number) => void;
  trackColours: string[];
  trackMutes: boolean[];
  onToggleMute: (trackIndex: number) => void;
}

function TrackList({ tracks, currentTrack, onSelectTrack, trackColours, trackMutes, onToggleMute }: TrackListProps) {
  return (
    <div className="min-w-[300px] w-full bg-gray-900 text-white p-4 border border-gray-700 rounded">
      {tracks.map((_, index) => (
        <div className="min-w-[280px]" key={index} onClick={() => onSelectTrack(index)}>
          <TrackItem
            track={{ id: index, name: `Track ${index}` }}
            isActive={currentTrack === index}
            colour={trackColours[index]}
            isMuted={trackMutes[index]}
            onToggleMute={() => onToggleMute(index)}
          />
        </div>
      ))}
    </div>
  );
}

export default TrackList;
