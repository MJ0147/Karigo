import React, { useState } from 'react';
import { BackendProvider } from './BackendContext';
import { RiderApp } from './RiderApp';
import { DriverApp } from './DriverApp';
import { ArrowLeftRight } from 'lucide-react';

export const Main = () => {
  const [appMode, setAppMode] = useState<'rider' | 'driver'>('rider');

  return (
    <BackendProvider>
      <div className="w-full h-[100dvh] flex flex-col bg-black">
        <div className="flex-1 w-full max-w-md mx-auto relative bg-white overflow-hidden shadow-2xl">
          {appMode === 'rider' ? <RiderApp /> : <DriverApp />}
          
          {/* Global Role Switcher - Top Right */}
          <div className="absolute top-4 right-4 z-[100]">
            <button 
              onClick={() => setAppMode(prev => prev === 'rider' ? 'driver' : 'rider')}
              className="bg-white/90 backdrop-blur-md text-gray-900 px-3 py-2 rounded-full shadow-lg border border-gray-200 hover:bg-gray-50 transition-all active:scale-95 flex items-center gap-2 group"
              title={`Switch to ${appMode === 'rider' ? 'Driver' : 'Rider'} App`}
            >
              <div className={`w-2 h-2 rounded-full transition-colors ${appMode === 'rider' ? 'bg-yellow-400' : 'bg-green-500'}`}></div>
              <span className="text-xs font-bold hidden group-hover:block transition-all max-w-0 group-hover:max-w-xs overflow-hidden whitespace-nowrap">
                {appMode === 'rider' ? 'Driver App' : 'Rider App'}
              </span>
              <ArrowLeftRight size={16} className="text-gray-500" />
            </button>
          </div>
        </div>
      </div>
    </BackendProvider>
  );
};