import React from 'react';
import { Navigation, MapPin } from 'lucide-react';
import { Button } from './Button';
import { Input } from './Input';
import { LOCATIONS } from '../constants';

interface LocationSearchProps {
  pickup: string;
  setPickup: (val: string) => void;
  dropoff: string;
  setDropoff: (val: string) => void;
  onConfirm: () => void;
}

export const LocationSearch: React.FC<LocationSearchProps> = ({
  pickup,
  setPickup,
  dropoff,
  setDropoff,
  onConfirm
}) => {
  return (
    <div className="flex flex-col h-full justify-end p-4 pb-8 space-y-4 bg-gradient-to-t from-gray-900/10 to-transparent pointer-events-none">
      <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4 pointer-events-auto">
        <h2 className="text-xl font-bold text-gray-800">Where to?</h2>
        <Input 
          label="Pickup"
          placeholder="Current Location" 
          value={pickup} 
          onChange={(e) => setPickup(e.target.value)}
          icon={Navigation}
        />
        <Input 
          label="Destination"
          placeholder="Enter destination" 
          value={dropoff} 
          onChange={(e) => setDropoff(e.target.value)}
          icon={MapPin}
        />

        {/* Quick Suggestion Chips */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {LOCATIONS.map(loc => (
            <button 
              key={loc.id} 
              onClick={() => setDropoff(loc.name)}
              className="whitespace-nowrap px-4 py-2 bg-gray-100 rounded-full text-sm text-gray-600 hover:bg-yellow-100 hover:text-yellow-800 transition-colors font-medium border border-transparent hover:border-yellow-300"
            >
              {loc.name}
            </button>
          ))}
        </div>

        <Button onClick={onConfirm}>
          Check Prices
        </Button>
      </div>
    </div>
  );
};