import React from 'react';
import { Smartphone, Wallet } from 'lucide-react';
import { Button } from './Button';
import { RIDE_TYPES } from '../constants';
import { RideType, PaymentMethod } from '../types';

interface RideSelectionProps {
  fare: number;
  selectedRide: RideType;
  setSelectedRide: (type: RideType) => void;
  selectedPayment: PaymentMethod;
  setSelectedPayment: (method: PaymentMethod) => void;
  onBook: () => void;
  onBack: () => void;
}

export const RideSelection: React.FC<RideSelectionProps> = ({
  fare,
  selectedRide,
  setSelectedRide,
  selectedPayment,
  setSelectedPayment,
  onBook,
  onBack
}) => {
  return (
    <div className="flex flex-col h-full justify-end bg-black/20 backdrop-blur-[2px]">
      <div className="bg-white rounded-t-3xl shadow-2xl p-6 animate-slide-up">
        
        {/* Ride Selector */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Choose your ride</h3>
          <div className="space-y-3 max-h-[25vh] overflow-y-auto">
            {RIDE_TYPES.map(type => (
              <div 
                key={type.id}
                onClick={() => setSelectedRide(type)}
                className={`flex items-center justify-between p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedRide.id === type.id ? 'border-yellow-400 bg-yellow-50 shadow-sm' : 'border-transparent bg-gray-50 hover:bg-gray-100'}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-3xl">{type.image}</span>
                  <div>
                    <p className="font-bold text-gray-900">{type.name}</p>
                    <p className="text-xs text-gray-500">{type.desc}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">D{Math.round(fare * type.multiplier)}</p>
                  <p className="text-xs text-gray-500">~15 min</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Selector */}
        <div className="mb-6">
          <h3 className="font-bold text-gray-800 mb-3 text-lg">Payment Method</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => setSelectedPayment('wave')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedPayment === 'wave' ? 'border-blue-400 bg-blue-50 text-blue-900 shadow-sm' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              <Smartphone className={`w-6 h-6 ${selectedPayment === 'wave' ? 'text-blue-500' : 'text-gray-400'}`} />
              <span className="font-bold text-sm">Wave</span>
            </button>
            <button 
              onClick={() => setSelectedPayment('cash')}
              className={`p-4 rounded-xl border-2 flex flex-col items-center gap-2 transition-all ${selectedPayment === 'cash' ? 'border-green-500 bg-green-50 text-green-900 shadow-sm' : 'border-gray-100 bg-gray-50 text-gray-500 hover:bg-gray-100'}`}
            >
              <Wallet className={`w-6 h-6 ${selectedPayment === 'cash' ? 'text-green-600' : 'text-gray-400'}`} />
              <span className="font-bold text-sm">Cash</span>
            </button>
          </div>
        </div>

        <div className="flex gap-3">
          <Button variant="ghost" onClick={onBack} className="flex-1">Back</Button>
          <Button onClick={onBook} className="flex-[2]">Confirm Booking</Button>
        </div>
      </div>
    </div>
  );
};