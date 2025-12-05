import React from 'react';
import { LucideIcon } from 'lucide-react';

interface InputProps {
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: LucideIcon;
  label?: string;
}

export const Input: React.FC<InputProps> = ({ placeholder, value, onChange, icon: Icon, label }) => (
  <div className="relative mb-4">
    {label && <label className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1 block">{label}</label>}
    <div className="relative">
      {Icon && <Icon className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />}
      <input
        type="text"
        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:bg-white transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  </div>
);