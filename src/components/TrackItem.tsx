import React from 'react';

interface TrackItemProps {
  track: { id: number; name: string };
  isActive: boolean;
  colour: string;
  isMuted: boolean;
  onToggleMute: () => void;
}

function TrackItem({ track, isActive, colour, isMuted, onToggleMute }: TrackItemProps) {
  return (
    <div
      className={`flex items-center justify-between px-4 py-2 border-b border-gray-700  min-w-[280px]
      ${isActive ? 'bg-blue-900' : 'bg-gray-900'} hover:bg-gray-800`}
      style={{ borderLeft: `4px solid ${colour}` }}
    >
      <span className="text-orange-500 font-semibold">{track.name}</span>
      <button 
        onClick={onToggleMute} 
        className={`text-sm px-2 py-1 rounded ${isMuted ? 'bg-red-700' : 'bg-green-700'}`}
      >
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
    </div>
  );
}

export default TrackItem;
