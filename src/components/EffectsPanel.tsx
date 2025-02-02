import React from 'react';

function EffectsPanel() {
  return (
    <div className="p-4 bg-gray-800 border border-gray-700 text-white rounded space-y-3">
      <div>
        <label className="block mb-1 font-semibold">Reverb</label>
        <input type="range" min="0" max="100" className="w-full" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Delay</label>
        <input type="range" min="0" max="100" className="w-full" />
      </div>
      <div>
        <label className="block mb-1 font-semibold">Bitcrusher</label>
        <input type="range" min="0" max="100" className="w-full" />
      </div>
    </div>
  );
}

export default EffectsPanel;
