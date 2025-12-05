import React from 'react';
import { Star, Phone, MessageCircle } from 'lucide-react';
import { Driver, RideStatus } from '../types';

interface RideStatusOverlayProps {
  rideStatus: RideStatus;
  driver: Driver | null;
}

export const RideStatusOverlay: React.FC<RideStatusOverlayProps> = ({ rideStatus, driver }) => {
  return (
    <div className="flex flex-col h-full justify-end pointer-events-none">
      <div className="bg-white pointer-events-auto rounded-t-3xl shadow-2xl p-6 pb-8 animate-slide-up">
        
        {/* Status Header */}
        <div className="flex items-center justify-between mb-6 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {rideStatus === 'arriving' ? 'Driver is arriving...' : 
               rideStatus === 'arrived' ? 'Driver is here!' :
               'Heading to destination'}
            </h2>
            <p className="text-sm text-gray-500">
              {rideStatus === 'arriving' ? '2 mins away' : 
               rideStatus === 'arrived' ? 'Meet at pickup point' :
               `Est. arrival ${new Date(Date.now() + 15*60000).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}`}
            </p>
          </div>
          <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
            rideStatus === 'arriving' ? 'bg-yellow-100 text-yellow-800' : 
            rideStatus === 'arrived' ? 'bg-green-100 text-green-800' : 
            'bg-blue-100 text-blue-800'
          }`}>
            {rideStatus}
          </div>
        </div>

        {/* Driver Card */}
        {driver && (
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 bg-gray-100 rounded-full flex items-center justify-center text-2xl border-2 border-white shadow-md overflow-hidden">
               👨🏿
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 text-lg">{driver.name}</h3>
              <div className="flex items-center gap-1 text-xs text-gray-500 font-medium">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span>{driver.rating}</span>
                <span className="text-gray-300">•</span>
                <span>{driver.car}</span>
              </div>
            </div>
            <div className="text-right">
              <div className="bg-gray-100 px-2 py-1 rounded border border-gray-200 font-mono text-sm font-bold text-gray-700">
                {driver.plate}
              </div>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
           <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors">
             <Phone size={18} /> Call Driver
           </button>
           <button className="flex items-center justify-center gap-2 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-700 font-medium hover:bg-gray-100 transition-colors">
             <MessageCircle size={18} /> Message
           </button>
        </div>
      </div>
    </div>
  );
};