import React, { useState, useEffect } from 'react';
import { Power, MapPin, Navigation, DollarSign, CheckCircle, Car } from 'lucide-react';
import { useBackend } from './BackendContext';
import { Button } from './components/Button';
import { MapCanvas } from './components/MapCanvas';

export const DriverApp: React.FC = () => {
  const { 
    isDriverOnline, 
    toggleDriverOnline, 
    currentRide, 
    acceptRide, 
    updateRideStatus, 
    completeRide,
    driverTotalEarnings,
    driverLocation
  } = useBackend();

  // Local state for UI feedback
  const [notification, setNotification] = useState<string | null>(null);

  // Play sound or show notification when a ride is requested
  useEffect(() => {
    if (isDriverOnline && currentRide?.status === 'requested') {
      setNotification('New Ride Request!');
    } else {
      setNotification(null);
    }
  }, [currentRide, isDriverOnline]);

  const renderOffline = () => (
    <div className="absolute inset-0 z-10 bg-gray-900/80 backdrop-blur-sm flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mb-6 shadow-2xl border-4 border-gray-700">
        <Car size={48} className="text-gray-500" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-2">You are Offline</h2>
      <p className="text-gray-400 mb-8">Go online to start receiving ride requests.</p>
      <button 
        onClick={toggleDriverOnline}
        className="w-full max-w-xs py-4 bg-green-500 hover:bg-green-600 text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-2 transition-all hover:scale-105"
      >
        <Power size={24} /> GO ONLINE
      </button>
    </div>
  );

  const renderRequestCard = () => {
    if (!currentRide || currentRide.status !== 'requested') return null;

    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-6 border-t-4 border-yellow-400 animate-slide-up">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900">New Request</h3>
              <p className="text-gray-500 text-sm">{currentRide.rideType.name}</p>
            </div>
            <div className="text-right">
              <span className="block text-2xl font-bold text-gray-900">D{currentRide.fare}</span>
              <span className="text-xs font-bold bg-green-100 text-green-700 px-2 py-1 rounded uppercase">{currentRide.paymentMethod || 'Cash'}</span>
            </div>
          </div>
          
          <div className="space-y-4 mb-6 relative">
            {/* Connecting Line */}
            <div className="absolute left-[11px] top-8 bottom-4 w-0.5 bg-gray-200 -z-10"></div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-green-100 flex items-center justify-center text-green-600 shrink-0">
                <Navigation size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Pickup</p>
                <p className="font-medium text-gray-900">{currentRide.pickup}</p>
                <p className="text-xs text-gray-400">1.2 km away</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-6 h-6 rounded-full bg-red-100 flex items-center justify-center text-red-600 shrink-0">
                <MapPin size={14} />
              </div>
              <div>
                <p className="text-xs text-gray-500 uppercase font-bold">Dropoff</p>
                <p className="font-medium text-gray-900">{currentRide.dropoff}</p>
                <p className="text-xs text-gray-400">5.4 km trip</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
             <Button variant="danger" onClick={() => {}}>Decline</Button>
             <div className="relative w-full">
                <Button variant="secondary" onClick={acceptRide} className="w-full">
                   Accept Ride
                </Button>
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full animate-ping"></div>
             </div>
          </div>
        </div>
      </div>
    );
  };

  const renderActiveRideControls = () => {
    if (!currentRide || !['accepted', 'arriving', 'arrived', 'in_progress'].includes(currentRide.status)) return null;

    let buttonText = "Navigate to Pickup";
    let statusText = "Accepted - Start Driving";
    let nextAction = () => updateRideStatus('arriving');
    let variant: "primary" | "secondary" | "outline" | "ghost" | "danger" = "primary";

    if (currentRide.status === 'accepted') {
       buttonText = "Start Navigation";
       statusText = "Ready to go";
       nextAction = () => updateRideStatus('arriving');
    } else if (currentRide.status === 'arriving') {
       buttonText = "Arrived at Pickup";
       statusText = "Heading to Pickup";
       nextAction = () => updateRideStatus('arrived');
    } else if (currentRide.status === 'arrived') {
       buttonText = "Start Trip";
       statusText = "Waiting for Rider";
       nextAction = () => updateRideStatus('in_progress');
       variant = "secondary";
    } else if (currentRide.status === 'in_progress') {
       buttonText = "Complete Trip";
       statusText = "Driving to Destination";
       nextAction = completeRide;
       variant = "danger";
    }

    return (
      <div className="absolute bottom-0 left-0 right-0 p-4 z-50">
        <div className="bg-white rounded-2xl shadow-2xl p-6 animate-slide-up">
          <div className="flex items-center gap-4 mb-6 border-b border-gray-100 pb-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl">👤</div>
            <div className="flex-1">
              <h3 className="font-bold text-gray-900">{currentRide.riderName}</h3>
              <p className="text-green-600 font-medium text-sm">{statusText}</p>
            </div>
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center cursor-pointer">
               <Navigation size={20} />
            </div>
          </div>

          <Button variant={variant} onClick={nextAction}>{buttonText}</Button>
        </div>
      </div>
    );
  };

  const renderEarnings = () => (
    // Moved down to top-16 to avoid conflict with the top-right switch button
    <div className="absolute top-16 left-4 right-4 z-40">
       <div className="bg-white/90 backdrop-blur shadow-lg rounded-xl p-4 flex justify-between items-center border border-gray-100">
         <div className="flex items-center gap-3">
           <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-700">
             <DollarSign size={20} />
           </div>
           <div>
             <p className="text-xs text-gray-500 font-bold uppercase">Today</p>
             <p className="font-bold text-xl text-gray-900">D{driverTotalEarnings}</p>
           </div>
         </div>
         <button 
           onClick={toggleDriverOnline} 
           className="bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold transition-colors"
         >
           GO OFFLINE
         </button>
       </div>
    </div>
  );

  return (
    <div className="w-full h-full relative bg-gray-100 overflow-hidden font-sans">
      <MapCanvas 
         pickup={currentRide?.pickup || ''} 
         dropoff={currentRide?.dropoff || ''} 
         onLocationSelect={() => {}}
         driverLocation={driverLocation}
         rideStatus={currentRide?.status}
      />
      
      {/* Driver UI Layers */}
      {!isDriverOnline && renderOffline()}
      {isDriverOnline && renderEarnings()}
      {isDriverOnline && renderRequestCard()}
      {isDriverOnline && renderActiveRideControls()}
      
      {currentRide?.status === 'completed' && (
         <div className="absolute inset-0 z-50 bg-white flex flex-col items-center justify-center p-8 animate-fade-in">
            <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6">
              <CheckCircle size={48} />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">D{currentRide.fare}</h2>
            <p className="text-gray-500 mb-8">Trip Completed</p>
            <Button onClick={() => updateRideStatus('paid')}>Close</Button>
         </div>
      )}
    </div>
  );
};