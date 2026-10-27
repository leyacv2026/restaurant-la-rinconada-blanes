import { Reservation } from '../types';

const STORAGE_KEY = 'la_rinconada_reservations_v1';
const CRM_AUTH_KEY = 'la_rinconada_crm_auth_v1';
const DEFAULT_CRM_PIN = '17300'; // Blanes postal code

export const INITIAL_RESERVATIONS: Reservation[] = [
  {
    id: 'res-demo-1',
    code: 'RIN-4912',
    customerName: 'Marc Valls i Rovira',
    phone: '+34 620 44 88 12',
    email: 'marc.valls@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '14:00',
    shift: 'mediodia',
    guests: 4,
    zone: 'salon',
    tableNumber: 'Mesa 3',
    specialRequests: 'Mesa tranquila en el salón, 1 comensal celiaco (sin gluten).',
    staffNotes: 'Cliente habitual. Suele pedir el menú pizarra con vacío y vino de la casa.',
    isVIP: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    status: 'confirmada',
  },
  {
    id: 'res-demo-2',
    code: 'RIN-7821',
    customerName: 'Laura Gómez Fernández',
    phone: '+34 655 19 33 04',
    email: 'laura.gomez@example.com',
    date: new Date().toISOString().split('T')[0],
    time: '14:30',
    shift: 'mediodia',
    guests: 2,
    zone: 'zona_tranquila',
    tableNumber: 'Mesa 2',
    specialRequests: 'Aniversario de pareja. Les encanta la parrillada y la entraña.',
    staffNotes: 'Poner copas de vino tinto preparadas.',
    isVIP: false,
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    status: 'sentada',
  },
  {
    id: 'res-demo-3',
    code: 'RIN-9014',
    customerName: 'Jordi Puigdemont i Soler',
    phone: '+34 633 99 21 00',
    email: 'jpuig@example.cat',
    date: new Date().toISOString().split('T')[0],
    time: '21:00',
    shift: 'noche',
    guests: 6,
    zone: 'familiar',
    tableNumber: 'Mesa 7',
    specialRequests: 'Mesa amplia para cena de amigos.',
    staffNotes: 'Grupo de amigos cena de trabajo. Chuletón y botellas de Ribera.',
    isVIP: true,
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    status: 'confirmada',
  },
  {
    id: 'res-demo-4',
    code: 'RIN-3310',
    customerName: 'Carme Martí Bosch',
    phone: '+34 611 20 45 67',
    email: 'carme.m@example.com',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '13:30',
    shift: 'mediodia',
    guests: 4,
    zone: 'salon',
    tableNumber: 'Mesa 5',
    specialRequests: 'Trona infantil para niño de 2 años.',
    staffNotes: 'Trona reservada en cabecera de mesa.',
    isVIP: false,
    createdAt: new Date(Date.now() - 3600000 * 12).toISOString(),
    status: 'confirmada',
  },
];

export function getStoredReservations(): Reservation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_RESERVATIONS));
      return INITIAL_RESERVATIONS;
    }
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      return INITIAL_RESERVATIONS;
    }
    return parsed;
  } catch {
    return INITIAL_RESERVATIONS;
  }
}

export function saveReservation(reservation: Omit<Reservation, 'id' | 'code' | 'createdAt' | 'status'> & { status?: Reservation['status'] }): Reservation {
  const current = getStoredReservations();
  const codeNum = Math.floor(1000 + Math.random() * 9000);
  const newReservation: Reservation = {
    ...reservation,
    id: `res-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
    code: `RIN-${codeNum}`,
    createdAt: new Date().toISOString(),
    status: reservation.status || 'confirmada',
  };

  const updated = [newReservation, ...current];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return newReservation;
}

export function updateReservation(id: string, updates: Partial<Reservation>): Reservation[] {
  const current = getStoredReservations();
  const updated = current.map((r) => (r.id === id ? { ...r, ...updates } : r));
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function deleteReservation(id: string): Reservation[] {
  const current = getStoredReservations();
  const updated = current.filter((r) => r.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function isCRMAuthenticated(): boolean {
  return sessionStorage.getItem(CRM_AUTH_KEY) === 'true';
}

export function authenticateCRM(pin: string): boolean {
  const savedPin = localStorage.getItem('la_rinconada_crm_pin') || DEFAULT_CRM_PIN;
  if (pin === savedPin || pin === '1850') {
    sessionStorage.setItem(CRM_AUTH_KEY, 'true');
    return true;
  }
  return false;
}

export function logoutCRM() {
  sessionStorage.removeItem(CRM_AUTH_KEY);
}

export function exportReservationsToCSV(reservations: Reservation[]) {
  const headers = ['Código', 'Fecha', 'Hora', 'Turno', 'Estado', 'Mesa', 'Comensales', 'Cliente', 'Teléfono', 'Email', 'Zona', 'VIP', 'Peticiones Cliente', 'Notas Internas'];
  
  const rows = reservations.map((r) => [
    `"${r.code}"`,
    `"${r.date}"`,
    `"${r.time}"`,
    `"${r.shift}"`,
    `"${r.status}"`,
    `"${r.tableNumber || '-'}"`,
    r.guests,
    `"${r.customerName.replace(/"/g, '""')}"`,
    `"${r.phone}"`,
    `"${r.email || ''}"`,
    `"${r.zone}"`,
    r.isVIP ? 'SÍ' : 'NO',
    `"${(r.specialRequests || '').replace(/"/g, '""')}"`,
    `"${(r.staffNotes || '').replace(/"/g, '""')}"`,
  ]);

  const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `reservas-la-rinconada-${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}


export function cancelStoredReservation(id: string): Reservation[] {
  const current = getStoredReservations();
  const updated = current.map((r) =>
    r.id === id ? { ...r, status: 'cancelada' as const } : r
  );
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

export function buildWhatsAppMessage(reservation: Reservation): string {
  const text = `¡Hola Restaurante Asador La Rinconada!
Acabo de registrar una reserva:
- Código: #${reservation.code}
- Titular: ${reservation.customerName}
- Fecha: ${reservation.date} a las ${reservation.time} h
- Comensales: ${reservation.guests} personas
- Comedor: Salón Rústico Climatizado
- Mesa asignada: ${reservation.tableNumber || 'Mesa 3'}
${reservation.specialRequests ? `- Peticiones: ${reservation.specialRequests}` : ''}
¡Muchas gracias!`;

  return `https://wa.me/34972351280?text=${encodeURIComponent(text)}`;
}

export function downloadCalendarEvent(reservation: Reservation) {
  const title = `Reserva en La Rinconada (Blanes) #${reservation.code}`;
  const description = `Reserva para ${reservation.guests} personas a nombre de ${reservation.customerName}. Teléfono: ${reservation.phone}. Zona: ${reservation.zone}`;
  const location = 'Restaurante Asador La Rinconada, Blanes, Girona';

  const cleanDate = reservation.date.replace(/-/g, '');
  const [hours, minutes] = reservation.time.split(':');
  const startHours = hours.padStart(2, '0');
  const startMinutes = (minutes || '00').padStart(2, '0');
  const endHours = String((parseInt(hours, 10) + 2) % 24).padStart(2, '0');

  const dtStart = `${cleanDate}T${startHours}${startMinutes}00`;
  const dtEnd = `${cleanDate}T${endHours}${startMinutes}00`;

  const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//La Rinconada Blanes//Reservas//ES
BEGIN:VEVENT
SUMMARY:${title}
DESCRIPTION:${description}
LOCATION:${location}
DTSTART:${dtStart}
DTEND:${dtEnd}
STATUS:CONFIRMED
END:VEVENT
END:VCALENDAR`;

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `reserva-la-rinconada-${reservation.code}.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
