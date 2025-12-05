import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import { Ride, RideStatus, RideType, PaymentMethod, Coordinates } from './types';
import { DRIVERS, LOCATIONS } from './constants';

interface BackendContextType {
  // State
  currentRide: Ride | null;
  isDriverOnline: boolean;
  driverTotalEarnings: number;
  driverLocation: Coordinates | null;
  
  // Actions
  requestRide: (pickup: string, dropoff: string, fare: number, rideType: RideType, paymentMethod: PaymentMethod) => void;
  acceptRide: () => void;
  updateRideStatus: (status: RideStatus) => void;
  completeRide: () => void;
  rateDriver: (rating: number) => void;
  toggleDriverOnline: () => void;
  resetApp: () => void;
}

const BackendContext = createContext<BackendContextType | undefined>(undefined);

// Helper to find coords by name
const getCoords = (name: string): Coordinates | null => {
  const loc = LOCATIONS.find(l => l.name === name);
  return loc ? { lat: loc.lat, long: loc.long } : null;
};

export const BackendProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentRide, setCurrentRide] = useState<Ride | null>(null);
  const [isDriverOnline, setIsDriverOnline] = useState(false);
  const [driverTotalEarnings, setDriverTotalEarnings] = useState(4500); // Mock starting balance
  const [driverLocation, setDriverLocation] = useState<Coordinates | null>(null);

  // Simulation Refs
  const simulationInterval = useRef<ReturnType<typeof setInterval> | null>(null);

  // --- GPS Simulation Logic ---
  useEffect(() => {
    if (!currentRide) {
      setDriverLocation(null);
      if (simulationInterval.current) clearInterval(simulationInterval.current);
      return;
    }

    const pickupCoords = getCoords(currentRide.pickup);
    const dropoffCoords = getCoords(currentRide.dropoff);

    // If locations aren't found in our mock DB, default to center map
    const startPos = pickupCoords || { lat: 50, long: 50 };
    const endPos = dropoffCoords || { lat: 50, long: 50 };

    if (simulationInterval.current) {
      clearInterval(simulationInterval.current);
    }

    let progress = 0;
    const step = 0.005; // Speed of simulation

    if (currentRide.status === 'arriving') {
      // Simulate moving from a random nearby point TO the pickup
      const driverStartLat = startPos.lat + 10;
      const driverStartLong = startPos.long - 10;

      simulationInterval.current = setInterval(() => {
        progress += step;
        if (progress >= 1) progress = 1;
        
        setDriverLocation({
          lat: driverStartLat + (startPos.lat - driverStartLat) * progress,
          long: driverStartLong + (startPos.long - driverStartLong) * progress
        });
      }, 50);

    } else if (currentRide.status === 'in_progress') {
      // Simulate moving FROM pickup TO dropoff
      simulationInterval.current = setInterval(() => {
        progress += step;
        if (progress >= 1) progress = 1;

        setDriverLocation({
          lat: startPos.lat + (endPos.lat - startPos.lat) * progress,
          long: startPos.long + (endPos.long - startPos.long) * progress
        });
      }, 100); // Slower for the actual ride
    
    } else if (currentRide.status === 'accepted') {
      // Initialize driver position near pickup
      setDriverLocation({ lat: startPos.lat + 10, long: startPos.long - 10 });
    } else if (currentRide.status === 'arrived') {
      // Driver is static at pickup
      setDriverLocation(startPos);
    } else if (currentRide.status === 'completed') {
       // Driver is static at dropoff
       setDriverLocation(endPos);
    }

    return () => {
      if (simulationInterval.current) clearInterval(simulationInterval.current);
    };
  }, [currentRide?.status, currentRide?.pickup, currentRide?.dropoff]);

  // Rider Actions
  const requestRide = (pickup: string, dropoff: string, fare: number, rideType: RideType, paymentMethod: PaymentMethod) => {
    const newRide: Ride = {
      id: Math.random().toString(36).substr(2, 9),
      riderName: 'John Doe',
      pickup,
      dropoff,
      fare,
      status: 'requested',
      rideType,
      paymentMethod,
      driver: null,
      timestamp: Date.now()
    };
    setCurrentRide(newRide);
  };

  const rateDriver = (rating: number) => {
    setCurrentRide(null); // Clear session
    setDriverLocation(null);
  };

  // Driver Actions
  const toggleDriverOnline = () => setIsDriverOnline(prev => !prev);

  const acceptRide = () => {
    if (!currentRide) return;
    
    // Assign a mock driver
    const myDriverProfile = DRIVERS[0]; 

    setCurrentRide({
      ...currentRide,
      status: 'accepted',
      driver: myDriverProfile
    });
  };

  const updateRideStatus = (status: RideStatus) => {
    if (!currentRide) return;
    setCurrentRide({ ...currentRide, status });
  };

  const completeRide = () => {
    if (!currentRide) return;
    setDriverTotalEarnings(prev => prev + currentRide.fare);
    updateRideStatus('completed');
  };

  const resetApp = () => {
      setCurrentRide(null);
      setDriverLocation(null);
  }

  return (
    <BackendContext.Provider value={{
      currentRide,
      isDriverOnline,
      driverTotalEarnings,
      driverLocation,
      requestRide,
      acceptRide,
      updateRideStatus,
      completeRide,
      rateDriver,
      toggleDriverOnline,
      resetApp
    }}>
      {children}
    </BackendContext.Provider>
  );
};

export const useBackend = () => {
  const context = useContext(BackendContext);
  if (context === undefined) {
    throw new Error('useBackend must be used within a BackendProvider');
  }
  return context;
};