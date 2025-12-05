import React from 'react';
import { MapPin, Car } from 'lucide-react';
import { Location, Coordinates, RideStatus } from '../types';
import { LOCATIONS } from '../constants';

interface MapCanvasProps {
  pickup: string;
  dropoff: string;
  onLocationSelect: (loc: Location, type: 'pickup' | 'dropoff') => void;
  driverLocation?: Coordinates | null;
  rideStatus?: RideStatus;
}

export const MapCanvas: React.FC<MapCanvasProps> = ({ 
  pickup, 
  dropoff, 
  onLocationSelect,
  driverLocation,
  rideStatus
}) => {
  // Helper to get coordinates from location name
  const getCoords = (name: string) => LOCATIONS.find(l => l.name === name);
  const pickupCoords = getCoords(pickup);
  const dropoffCoords = getCoords(dropoff);

  return (
    <div className="absolute inset-0 bg-blue-50 opacity-100 overflow-hidden -z-10">
      {/* Abstract Map Background Grid */}
      <div className="w-full h-full relative opacity-20" style={{ backgroundImage: 'radial-gradient(#94A3B8 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>
      
      {/* Background Roads */}
      <svg className="absolute inset-0 w-full h-full stroke-gray-300 stroke-[15] fill-none pointer-events-none">
        <path d="M-10,100 Q150,50 300,150 T600,100" />
        <path d="M200,0 L200,800" />
        <path d="M50,400 L500,450" />
        <path d="M300,150 L500,450" />
      </svg>

      {/* Dynamic Route Tracker Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0">
         {/* 1. Planned Route (Dashed Grey) - Visible when both points selected but no active ride moving yet */}
         {pickupCoords && dropoffCoords && (!rideStatus || rideStatus === 'requested') && (
           <line 
             x1={`${pickupCoords.long}%`} y1={`${pickupCoords.lat}%`}
             x2={`${dropoffCoords.long}%`} y2={`${dropoffCoords.lat}%`}
             stroke="#64748B" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round"
             className="opacity-50 animate-pulse"
           />
         )}

         {/* 2. Driver Approaching Route (Solid Yellow) */}
         {driverLocation && pickupCoords && (rideStatus === 'accepted' || rideStatus === 'arriving') && (
            <>
              {/* Background Path */}
              <line 
                x1={`${driverLocation.long}%`} y1={`${driverLocation.lat}%`}
                x2={`${pickupCoords.long}%`} y2={`${pickupCoords.lat}%`}
                stroke="#FEF08A" strokeWidth="8" strokeLinecap="round" className="opacity-50"
              />
              {/* Foreground Path */}
              <line 
                x1={`${driverLocation.long}%`} y1={`${driverLocation.lat}%`}
                x2={`${pickupCoords.long}%`} y2={`${pickupCoords.lat}%`}
                stroke="#EAB308" strokeWidth="3" strokeLinecap="round" strokeDasharray="12 4"
                className="drop-shadow-sm"
              />
            </>
         )}

         {/* 3. In Progress Route (Solid Green) */}
         {driverLocation && dropoffCoords && rideStatus === 'in_progress' && (
            <>
              {/* Full Route Background */}
              {pickupCoords && (
                 <line 
                   x1={`${pickupCoords.long}%`} y1={`${pickupCoords.lat}%`}
                   x2={`${dropoffCoords.long}%`} y2={`${dropoffCoords.lat}%`}
                   stroke="#86EFAC" strokeWidth="8" strokeLinecap="round" className="opacity-30"
                 />
              )}
              {/* Active Segment */}
              <line 
                x1={`${driverLocation.long}%`} y1={`${driverLocation.lat}%`}
                x2={`${dropoffCoords.long}%`} y2={`${dropoffCoords.lat}%`}
                stroke="#22C55E" strokeWidth="4" strokeLinecap="round"
                className="drop-shadow-md"
              />
            </>
         )}
      </svg>

      {/* Location Markers */}
      {LOCATIONS.map((loc) => (
        <div 
          key={loc.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-10"
          style={{ left: `${loc.long}%`, top: `${loc.lat}%` }}
          onClick={() => !pickup ? onLocationSelect(loc, 'pickup') : onLocationSelect(loc, 'dropoff')}
        >
          {/* Pulse effect for target destination */}
          {((rideStatus === 'arriving' && pickup === loc.name) || (rideStatus === 'in_progress' && dropoff === loc.name)) && (
             <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-50 scale-150"></div>
          )}

          <div className={`p-2 rounded-full shadow-lg transition-transform hover:scale-125 relative z-10 ${pickup === loc.name ? 'bg-green-500 text-white scale-110' : dropoff === loc.name ? 'bg-red-500 text-white scale-110' : 'bg-white text-gray-700'}`}>
            <MapPin size={24} fill="currentColor" />
          </div>
          <span className="absolute top-full left-1/2 -translate-x-1/2 bg-black/80 text-white text-[10px] px-2 py-1 rounded mt-1 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none font-bold z-20">
            {loc.name}
          </span>
        </div>
      ))}
      
      {/* Real-time Driver Tracker Marker */}
      {driverLocation && (
        <div 
          className="absolute transform -translate-x-1/2 -translate-y-1/2 z-30 transition-all duration-300 ease-linear will-change-[left,top]"
          style={{ left: `${driverLocation.long}%`, top: `${driverLocation.lat}%` }}
        >
          <div className="relative">
            <div className="bg-yellow-400 p-2 rounded-full shadow-xl border-2 border-white relative z-10">
              <Car size={20} className="text-black transform -scale-x-100" />
            </div>
            {/* GPS Pulse Effect */}
            <div className="absolute top-1/2 left-1/2 w-16 h-16 -translate-x-1/2 -translate-y-1/2 bg-yellow-400/30 rounded-full animate-pulse pointer-events-none"></div>
          </div>
        </div>
      )}
    </div>
  );
};