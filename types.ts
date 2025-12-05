export interface Location {
  id: string;
  name: string;
  lat: number;
  long: number;
  type: 'hub' | 'destination' | 'market' | 'residential' | 'transport' | 'tourism';
}

export interface Coordinates {
  lat: number;
  long: number;
}

export interface RideType {
  id: string;
  name: string;
  multiplier: number;
  image: string;
  desc: string;
}

export interface Driver {
  name: string;
  car: string;
  plate: string;
  rating: number;
  trips: number;
}

export type PaymentMethod = 'cash' | 'wave' | null;

export type ViewState = 'home' | 'selecting' | 'confirm' | 'finding' | 'riding' | 'payment' | 'rating';

export type RideStatus = '' | 'requested' | 'accepted' | 'arriving' | 'arrived' | 'in_progress' | 'completed' | 'paid';

export interface NotificationItem {
  id: number;
  msg: string;
}

export interface Ride {
  id: string;
  riderName: string;
  pickup: string;
  dropoff: string;
  fare: number;
  status: RideStatus;
  rideType: RideType;
  paymentMethod: PaymentMethod;
  driver: Driver | null;
  timestamp: number;
}