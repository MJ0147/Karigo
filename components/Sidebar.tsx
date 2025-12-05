import React from 'react';
import { CreditCard, Clock, User } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 z-50 flex">
      <div className="w-3/4 h-full bg-white shadow-2xl p-6 flex flex-col animate-slide-right">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-yellow-400 rounded-full flex items-center justify-center text-xl font-bold border-4 border-yellow-100">JD</div>
          <div>
            <h2 className="font-bold text-lg text-gray-900">John Doe</h2>
            <p className="text-xs text-gray-500 font-medium">+220 700 0000</p>
          </div>
        </div>
        
        <nav className="space-y-4 flex-1">
          <div className="flex items-center gap-3 p-3 bg-yellow-50 text-yellow-800 rounded-xl font-medium border border-yellow-100">
            <CreditCard size={20} /> Payments
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium cursor-pointer transition-colors">
            <Clock size={20} /> Trip History
          </div>
          <div className="flex items-center gap-3 p-3 text-gray-600 hover:bg-gray-50 rounded-xl font-medium cursor-pointer transition-colors">
            <User size={20} /> Profile
          </div>
        </nav>

        <div className="mt-auto">
           <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 p-2 opacity-10">
                <CreditCard size={60} />
             </div>
             <h4 className="font-bold text-blue-900 text-xs uppercase tracking-wider mb-1">Wave Balance</h4>
             <p className="text-3xl font-bold text-blue-600">D 4,500</p>
           </div>
        </div>
      </div>
      <div className="flex-1 bg-black/20 backdrop-blur-sm" onClick={onClose}></div>
    </div>
  );
};