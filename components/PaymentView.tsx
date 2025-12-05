import React from 'react';
import { CheckCircle, Star, Smartphone, Wallet } from 'lucide-react';
import { Button } from './Button';
import { PaymentMethod, RideType } from '../types';

interface PaymentViewProps {
  dropoff: string;
  fare: number;
  selectedRide: RideType;
  selectedPayment: PaymentMethod;
  onClose: () => void;
}

export const PaymentView: React.FC<PaymentViewProps> = ({
  dropoff,
  fare,
  selectedRide,
  selectedPayment,
  onClose
}) => {
  const finalFare = Math.round(fare * selectedRide.multiplier);

  return (
    <div className="h-full bg-white flex flex-col items-center p-6 pt-20 animate-fade-in relative z-50">
      <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-6 animate-pulse ring-8 ring-green-50">
        <CheckCircle size={40} />
      </div>
      
      <h2 className="text-2xl font-bold text-gray-900 mb-2">Trip Completed!</h2>
      <p className="text-gray-500 mb-8 text-center">You have arrived at <span className="font-semibold text-gray-800">{dropoff}</span></p>

      <div className="w-full bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 shadow-sm">
        <div className="flex justify-between items-center mb-4">
          <span className="text-gray-600 font-medium">Total Fare</span>
          <span className="text-3xl font-bold text-gray-900">D{finalFare}</span>
        </div>
        
        <div className="flex items-center gap-3 p-4 bg-white rounded-xl border border-gray-200">
          {selectedPayment === 'wave' ? (
            <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white shrink-0">
              <Smartphone size={20} />
            </div>
          ) : (
            <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center text-white shrink-0">
              <Wallet size={20} />
            </div>
          )}
          <div>
            <p className="font-bold text-sm text-gray-900">
              {selectedPayment === 'wave' ? 'Wave Mobile Money' : 'Cash Payment'}
            </p>
            <p className="text-xs text-gray-500">
              {selectedPayment === 'wave' ? 'Waiting for confirmation...' : 'Pay directly to driver'}
            </p>
          </div>
        </div>

        {selectedPayment === 'wave' && (
          <div className="mt-4 pt-4 border-t border-dashed border-gray-300 text-center">
             <p className="text-xs text-gray-500 mb-2">Scan to pay Driver</p>
             <div className="w-32 h-32 bg-gray-900 mx-auto rounded-lg mb-2 flex items-center justify-center text-white text-xs shadow-inner">
               <div className="grid grid-cols-4 gap-1 p-2">
                 {[...Array(16)].map((_, i) => (
                    <div key={i} className={`w-full h-full rounded-sm ${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}></div>
                 ))}
               </div>
             </div>
             <p className="text-xs font-mono text-blue-600 font-bold bg-blue-50 py-1 rounded">Dial *123*4*9922#</p>
          </div>
        )}
      </div>

      <div className="mt-auto w-full space-y-4">
        <div className="flex justify-center gap-3 mb-2">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} size={36} className="text-gray-200 hover:text-yellow-400 cursor-pointer transition-colors" fill="currentColor" />
          ))}
        </div>
        <p className="text-center text-xs text-gray-400 mb-4">Rate your driver to finish</p>
        <Button onClick={onClose} variant="primary">Submit Rating & Close</Button>
      </div>
    </div>
  );
};