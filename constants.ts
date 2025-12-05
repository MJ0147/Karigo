import { Location, RideType, Driver } from './types';

export const LOCATIONS: Location[] = [
  { id: 'westfield', name: 'Westfield Junction', lat: 50, long: 50, type: 'hub' },
  { id: 'senegambia', name: 'Senegambia Strip', lat: 20, long: 80, type: 'destination' },
  { id: 'banjul', name: 'Banjul Market', lat: 80, long: 90, type: 'market' },
  { id: 'brusubi', name: 'Brusubi Turntable', lat: 10, long: 30, type: 'residential' },
  { id: 'airport', name: 'Banjul Int. Airport', lat: 5, long: 10, type: 'transport' },
  { id: 'bakau', name: 'Bakau Kachikally', lat: 70, long: 20, type: 'tourism' },
];

export const RIDE_TYPES: RideType[] = [
  { id: 'yellow', name: 'Yellow Taxi', multiplier: 1, image: '🚖', desc: 'Classic roadside taxi' },
  { id: 'private', name: 'Private Ride', multiplier: 1.5, image: '🚘', desc: 'AC & Comfort' },
  { id: 'van', name: 'Gele Gele (Van)', multiplier: 0.6, image: '🚐', desc: 'Group transport' },
];

export const DRIVERS: Driver[] = [
  { name: 'Musa Bah', car: 'Mercedes 190D', plate: 'BJL 4521 A', rating: 4.8, trips: 1240 },
  { name: 'Lamin Ceesay', car: 'Toyota Corolla', plate: 'KM 9922 B', rating: 4.9, trips: 850 },
  { name: 'Fatoumatta Jallow', car: 'Hyundai Elantra', plate: 'WCR 1102 C', rating: 5.0, trips: 2100 },
];