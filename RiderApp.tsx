import React, { useState, useEffect } from 'react';
import { Menu, Car } from 'lucide-react';
import { useBackend } from './BackendContext';
import { MapCanvas } from './components/MapCanvas';
import { LocationSearch } from './components/LocationSearch';
import { RideSelection } from './components/RideSelection';
import { RideStatusOverlay } from './components/RideStatusOverlay';
import { PaymentView } from './components/PaymentView';
import { Sidebar } from './components/Sidebar';
import { LOCATIONS, RIDE_TYPES } from './constants';
import { Location, RideType, Driver, PaymentMethod, ViewState, NotificationItem } from './types';

export const RiderApp: React.FC = () => {
  // Use Global Backend State
  const { 
    currentRide, 
    requestRide, 
    driverLocation,
    resetApp: backendReset 
  } = useBackend();

  // --- Local UI State ---
  const [view, setView] = useState<ViewState>('home');
  const [pickup, setPickup] = useState('');
  const [dropoff, setDropoff] = useState('');
  const [selectedRide, setSelectedRide] = useState<RideType>(RIDE_TYPES[0]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentMethod>(null);
  const [fare, setFare] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  // --- Handlers ---

  const addNotification = (msg: string) => {
    const id = Date.now();
    setNotifications(prev => [...prev, { id, msg }]);
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 3000);
  };

  const handleLocationSelect = (loc: Location, type: 'pickup' | 'dropoff') => {
    if (type === 'pickup') setPickup(loc.name);
    else setDropoff(loc.name);
  };

  const calculateFare = () => {
    const baseFare = 50; 
    const distanceMultiplier = Math.floor(Math.random() * 150) + 50;
    const total = baseFare + distanceMultiplier;
    setFare(Math.round(total / 10) * 10);
  };

  const startBooking = () => {
    if (!pickup || !dropoff) {
      addNotification("Please select both pickup and dropoff locations.");
      return;
    }
    calculateFare();
    setView('confirm');
  };

  const handleRequestRide = () => {
    if (!selectedPayment) {
      addNotification("Please select a payment method (Wave or Cash).");
      return;
    }
    // Call backend
    requestRide(pickup, dropoff, Math.round(fare * selectedRide.multiplier), selectedRide, selectedPayment);
  };

  const handleReset = () => {
    backendReset();
    setView('home');
    setPickup('');
    setDropoff('');
    setSelectedPayment(null);
  };

  // --- Sync with Backend Status ---
  useEffect(() => {
    if (!currentRide) {
       // If backend cleared ride, reset to home if we are in a ride flow
       if (view === 'riding' || view === 'finding' || view === 'payment') {
         setView('home');
       }
       return;
    }

    // State machine driven by Backend
    switch (currentRide.status) {
      case 'requested':
        setView('finding');
        break;
      case 'accepted':
      case 'arriving':
      case 'arrived':
      case 'in_progress':
        setView('riding');
        if (currentRide.status === 'arrived') {
           addNotification("Driver has arrived!");
        }
        break;
      case 'completed':
        setView('payment');
        break;
      case 'paid':
        handleReset();
        break;
    }
  }, [currentRide?.status]);


  // --- Render ---

  return (
    <div className="w-full h-full relative overflow-hidden font-sans text-gray-900 flex flex-col bg-gray-100">
      
      {/* Header Buttons */}
      <div className="absolute top-0 left-0 right-0 z-20 p-4 pointer-events-none">
        {/* Menu Button (Top Left) */}
        <button 
          onClick={() => setSidebarOpen(true)}
          className="pointer-events-auto absolute top-4 left-4 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 active:scale-95 transition-transform"
        >
          <Menu size={20} />
        </button>

        {/* Status Pill (Centered) */}
        {view === 'riding' && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-2 rounded-full shadow-lg border border-gray-200 animate-fade-in pointer-events-auto">
             <span className="font-bold text-green-700 flex items-center gap-2 text-sm">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
               {currentRide?.status === 'arriving' ? 'Driver Arriving' : currentRide?.status === 'in_progress' ? 'On Trip' : 'Driver Here'}
             </span>
          </div>
        )}
      </div>

      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Notifications */}
      <div className="absolute top-20 left-4 right-4 z-40 space-y-2 pointer-events-none">
        {notifications.map(n => (
          <div key={n.id} className="bg-gray-800/90 backdrop-blur text-white px-4 py-3 rounded-xl shadow-xl text-sm flex items-center gap-3 animate-slide-up">
            <div className="w-2 h-2 bg-yellow-400 rounded-full shrink-0"></div>
            {n.msg}
          </div>
        ))}
      </div>

      <div className="flex-1 relative">
        {view !== 'payment' && (
          <MapCanvas 
            pickup={pickup} 
            dropoff={dropoff} 
            onLocationSelect={handleLocationSelect}
            driverLocation={driverLocation}
            rideStatus={currentRide?.status}
          />
        )}

        <div className="absolute inset-0 pointer-events-none [&>*]:pointer-events-auto">
          
          {view === 'home' && (
            <LocationSearch 
              pickup={pickup} 
              setPickup={setPickup} 
              dropoff={dropoff} 
              setDropoff={setDropoff} 
              onConfirm={startBooking} 
            />
          )}

          {view === 'confirm' && (
            <RideSelection 
              fare={fare}
              selectedRide={selectedRide}
              setSelectedRide={setSelectedRide}
              selectedPayment={selectedPayment}
              setSelectedPayment={setSelectedPayment}
              onBook={handleRequestRide}
              onBack={() => setView('home')}
            />
          )}

          {view === 'finding' && (
            <div className="flex flex-col items-center justify-center h-full bg-white/90 backdrop-blur animate-fade-in">
              <div className="relative mb-8">
                <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-25"></div>
                <div className="relative w-24 h-24 bg-yellow-400 rounded-full flex items-center justify-center shadow-xl">
                   <Car size={40} className="text-black animate-pulse" />
                </div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Contacting Drivers...</h3>
              <p className="text-gray-500 text-center px-8">Switch to the "Driver App" tab to accept this request.</p>
            </div>
          )}

          {view === 'riding' && (
            <RideStatusOverlay 
              rideStatus={currentRide?.status || ''} 
              driver={currentRide?.driver || null} 
            />
          )}

          {view === 'payment' && (
            <PaymentView 
              dropoff={currentRide?.dropoff || ''}
              fare={currentRide?.fare || 0}
              selectedRide={currentRide?.rideType || RIDE_TYPES[0]}
              selectedPayment={currentRide?.paymentMethod || 'cash'}
              onClose={handleReset}
            />
          )}
        </div>
      </div>
    </div>
  );
};