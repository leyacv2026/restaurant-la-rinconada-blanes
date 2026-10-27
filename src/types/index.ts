export type TableZone = 'salon' | 'zona_tranquila' | 'familiar';

export type ReservationShift = 'mediodia' | 'noche';

export type ReservationStatus = 'confirmada' | 'sentada' | 'completada' | 'no_show' | 'cancelada';

export interface Reservation {
  id: string;
  code: string;
  customerName: string;
  phone: string;
  email: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  shift: ReservationShift;
  guests: number;
  zone: TableZone;
  tableNumber?: string;
  specialRequests?: string;
  staffNotes?: string;
  isVIP?: boolean;
  depositStatus?: 'no_requerido' | 'pagado';
  createdAt: string;
  status: ReservationStatus;
}

export interface CustomerProfile {
  phone: string;
  name: string;
  email?: string;
  totalVisits: number;
  totalGuests: number;
  lastVisit: string;
  favoriteZone?: TableZone;
  dietaryNotes?: string[];
  isVIP?: boolean;
  internalNotes?: string;
}


export interface MenuItem {
  id: string;
  name: string;
  category: 'entrantes' | 'brasas' | 'menu_especial' | 'postres' | 'bodega';
  description: string;
  price: number;
  featured?: boolean;
  isPizarra?: boolean;
  tags?: string[];
  imageUrl?: string;
}

export interface GalleryPhoto {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  alt: string;
  tag: string;
  isAuthenticUserPhoto?: boolean;
}
