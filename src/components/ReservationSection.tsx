import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  MapPin,
  CheckCircle2,
  Share2,
  CalendarPlus,
  ArrowRight,
  ShieldCheck,
  UtensilsCrossed,
  MessageSquare,
} from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';
import { Reservation, TableZone, ReservationShift } from '../types';
import { saveReservation, buildWhatsAppMessage, downloadCalendarEvent } from '../utils/storage';

import { RESTAURANT_TABLES, findBestTableFor, RestaurantTable } from '../data/tables';

interface ReservationSectionProps {
  initialDate?: string;
  initialShift?: ReservationShift;
  initialGuests?: number;
  initialDishNote?: string;
  onReservationCreated: (reservation: Reservation) => void;
}

export const ReservationSection: React.FC<ReservationSectionProps> = ({
  initialDate,
  initialShift = 'mediodia',
  initialGuests = 2,
  initialDishNote = '',
  onReservationCreated,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];

  // Form states
  const [date, setDate] = useState<string>(initialDate || todayStr);
  const [shift, setShift] = useState<ReservationShift>(initialShift);
  const [time, setTime] = useState<string>('14:00');
  const [guests, setGuests] = useState<number>(initialGuests);
  const [zone, setZone] = useState<TableZone>('salon');
  const [selectedTable, setSelectedTable] = useState<string>('Mesa 3');
  const [customerName, setCustomerName] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>(initialDishNote);

  // Flow states
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [confirmedReservation, setConfirmedReservation] = useState<Reservation | null>(null);

  // Time slot options based on shift
  const lunchSlots = ['13:15', '13:30', '14:00', '14:30', '15:00', '15:15'];
  const dinnerSlots = ['20:00', '20:30', '21:00', '21:30', '22:00', '22:30'];

  const handleShiftChange = (newShift: ReservationShift) => {
    setShift(newShift);
    setTime(newShift === 'mediodia' ? '14:00' : '21:00');
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      // Pick best matching table automatically if not customized
      const best = findBestTableFor(zone, guests, []);
      if (best) setSelectedTable(best.name);
      setStep(2);
    } else if (step === 2) {
      // Create reservation with assigned table
      const finalTable = selectedTable || (findBestTableFor(zone, guests, [])?.name ?? 'Mesa 3');

      const newRes = saveReservation({
        customerName: customerName.trim(),
        phone: phone.trim(),
        email: email.trim(),
        date,
        time,
        shift,
        guests,
        zone,
        tableNumber: finalTable,
        specialRequests: specialRequests.trim() || undefined,
      });

      setConfirmedReservation(newRes);
      onReservationCreated(newRes);
      setStep(3);
    }
  };

  const handleReset = () => {
    setConfirmedReservation(null);
    setStep(1);
    setCustomerName('');
    setPhone('');
    setEmail('');
    setSpecialRequests('');
  };

  return (
    <section id="reservas" className="py-16 sm:py-24 bg-[#140f0c] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#ea580c] font-semibold mb-2">
            <CalendarIcon className="w-4 h-4" />
            <span>App de Reservas Oficial</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-white font-display">
            Reserva tu Mesa en La Rinconada
          </h2>
          <p className="text-sm sm:text-base text-[#bcaaa4] mt-2 max-w-xl mx-auto font-light">
            Garantiza tu mesa al instante sin intermediarios ni comisiones.
            Confirmación directa e inmediata con el asador.
          </p>
        </div>

        {/* Step Indicator */}
        {step < 3 && (
          <div className="flex items-center justify-center gap-3 mb-8 text-xs font-medium">
            <div className={`flex items-center gap-2 ${step >= 1 ? 'text-[#ea580c]' : 'text-[#6e5d54]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 1 ? 'bg-[#ea580c] text-white' : 'bg-[#291e16] text-[#6e5d54]'}`}>
                1
              </span>
              <span>Fecha & Horario</span>
            </div>
            <div className="w-8 h-[1px] bg-[#33261b]" />
            <div className={`flex items-center gap-2 ${step >= 2 ? 'text-[#ea580c]' : 'text-[#6e5d54]'}`}>
              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step >= 2 ? 'bg-[#ea580c] text-white' : 'bg-[#291e16] text-[#6e5d54]'}`}>
                2
              </span>
              <span>Zona & Datos</span>
            </div>
          </div>
        )}

        {/* Reservation Box */}
        <div className="bg-[#1b1510] border border-[#382a1e] rounded-xl p-6 sm:p-8 shadow-2xl">
          {step === 1 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              {/* Date selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  1. Elige el día de tu visita
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <input
                    type="date"
                    min={todayStr}
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    required
                    className="sm:col-span-2 bg-[#120e0b] border border-[#382a1e] text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-[#ea580c]"
                  />
                  <button
                    type="button"
                    onClick={() => setDate(todayStr)}
                    className={`py-2 px-3 text-xs font-medium rounded-lg border transition-colors ${
                      date === todayStr
                        ? 'bg-[#ea580c]/20 border-[#ea580c] text-[#ea580c]'
                        : 'bg-[#120e0b] border-[#382a1e] text-[#bcaaa4] hover:text-white'
                    }`}
                  >
                    Hoy
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      const tom = new Date(Date.now() + 86400000).toISOString().split('T')[0];
                      setDate(tom);
                    }}
                    className="py-2 px-3 text-xs font-medium rounded-lg border bg-[#120e0b] border-[#382a1e] text-[#bcaaa4] hover:text-white transition-colors"
                  >
                    Mañana
                  </button>
                </div>
              </div>

              {/* Shift selection */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  2. Turno del servicio
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleShiftChange('mediodia')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      shift === 'mediodia'
                        ? 'bg-[#291c13] border-[#ea580c] shadow-sm'
                        : 'bg-[#120e0b] border-[#382a1e] hover:border-[#4d3a2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Almuerzo / Mediodía</span>
                      <Clock className="w-4 h-4 text-[#ea580c]" />
                    </div>
                    <p className="text-xs text-[#a89993] mt-1">
                      Horario: 13:15 a 15:30 h (Menú del día disponible)
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleShiftChange('noche')}
                    className={`p-4 rounded-lg border text-left transition-all ${
                      shift === 'noche'
                        ? 'bg-[#291c13] border-[#ea580c] shadow-sm'
                        : 'bg-[#120e0b] border-[#382a1e] hover:border-[#4d3a2b]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-white">Cena / Noche</span>
                      <Clock className="w-4 h-4 text-[#ea580c]" />
                    </div>
                    <p className="text-xs text-[#a89993] mt-1">
                      Horario: 20:00 a 23:30 h (Ambiente acogedor a la brasa)
                    </p>
                  </button>
                </div>
              </div>

              {/* Time Slot Picker */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  3. Hora aproximada de llegada
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {(shift === 'mediodia' ? lunchSlots : dinnerSlots).map((slot) => {
                    const isSelected = time === slot;
                    return (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setTime(slot)}
                        className={`py-2 px-3 text-xs font-semibold rounded-md border text-center transition-colors tabular-nums ${
                          isSelected
                            ? 'bg-[#ea580c] border-[#ea580c] text-white shadow-sm'
                            : 'bg-[#120e0b] border-[#382a1e] text-[#d6ccc2] hover:text-white hover:border-[#523d2e]'
                        }`}
                      >
                        {slot} h
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guest Count */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  4. Número de comensales
                </label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => {
                    const isSelected = guests === num;
                    return (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setGuests(num)}
                        className={`w-11 h-11 text-sm font-bold rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-[#ea580c] border-[#ea580c] text-white'
                            : 'bg-[#120e0b] border-[#382a1e] text-[#d6ccc2] hover:text-white'
                        }`}
                      >
                        {num}
                      </button>
                    );
                  })}
                </div>
                {guests >= 8 && (
                  <p className="text-xs text-[#f97316] mt-2">
                    Para grupos de {guests} personas disponemos de mesas amplias en el salón interior rústico.
                  </p>
                )}
              </div>

              {/* Next Button */}
              <div className="pt-4 border-t border-[#33261b] flex justify-end">
                <button
                  type="submit"
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-lg transition-colors shadow-md"
                >
                  <span>Continuar a datos del titular</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleNextStep} className="space-y-6">
              {/* Summary Pill Bar */}
              <div className="bg-[#120e0b] border border-[#382a1e] rounded-lg p-3 text-xs text-[#bcaaa4] flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="text-white font-semibold">
                    {date} a las {time} h
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>{shift === 'mediodia' ? 'Almuerzo' : 'Cena'}</span>
                  <span aria-hidden="true">·</span>
                  <span>{guests} {guests === 1 ? 'comensal' : 'comensales'}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="text-[#ea580c] hover:underline font-medium"
                >
                  Modificar fecha
                </button>
              </div>

              {/* Atmosphere / Seating preference in Salon */}
              <div>
                <label className="block text-sm font-semibold text-white mb-2">
                  Preferencia de ubicación en el Salón Comedor
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setZone('salon');
                      const best = findBestTableFor('salon', guests, []);
                      if (best) setSelectedTable(best.name);
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      zone === 'salon'
                        ? 'bg-[#291c13] border-[#ea580c]'
                        : 'bg-[#120e0b] border-[#382a1e] hover:border-[#4d3a2b]'
                    }`}
                  >
                    <p className="text-sm font-bold text-white">Salón Principal</p>
                    <p className="text-xs text-[#a89993] mt-1">
                      El comedor tradicional con manteles a cuadros y paneles de madera de pino.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZone('zona_tranquila');
                      const best = findBestTableFor('zona_tranquila', guests, []);
                      if (best) setSelectedTable(best.name);
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      zone === 'zona_tranquila'
                        ? 'bg-[#291c13] border-[#ea580c]'
                        : 'bg-[#120e0b] border-[#382a1e] hover:border-[#4d3a2b]'
                    }`}
                  >
                    <p className="text-sm font-bold text-white">Rincón Íntimo</p>
                    <p className="text-xs text-[#a89993] mt-1">
                      Mesa tranquila con aplique de luz cálida, ideal para parejas.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setZone('familiar');
                      const best = findBestTableFor('familiar', guests, []);
                      if (best) setSelectedTable(best.name);
                    }}
                    className={`p-3.5 rounded-lg border text-left transition-all ${
                      zone === 'familiar'
                        ? 'bg-[#291c13] border-[#ea580c]'
                        : 'bg-[#120e0b] border-[#382a1e] hover:border-[#4d3a2b]'
                    }`}
                  >
                    <p className="text-sm font-bold text-white">Mesa Amplia / Grupo</p>
                    <p className="text-xs text-[#a89993] mt-1">
                      Espacio holgado para familias o grupos para disfrutar de parrilladas.
                    </p>
                  </button>
                </div>
              </div>

              {/* Specific Table Selection & Visual Confirmation */}
              <div className="bg-[#120e0b] border border-[#382a1e] rounded-lg p-4 space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <label className="text-xs font-bold text-white uppercase tracking-wider block">
                      Mesa asignada en el Salón Comedor
                    </label>
                    <p className="text-[11px] text-[#a89993]">
                      Asignada para {guests} {guests === 1 ? 'comensal' : 'comensales'}. Puedes seleccionar tu mesa preferida si lo deseas:
                    </p>
                  </div>
                  <span className="text-xs font-mono font-bold text-[#ea580c] bg-[#ea580c]/15 px-2.5 py-1 rounded border border-[#ea580c]/30">
                    {selectedTable}
                  </span>
                </div>

                <select
                  value={selectedTable}
                  onChange={(e) => setSelectedTable(e.target.value)}
                  className="w-full bg-[#1c1611] border border-[#382a1e] rounded-md px-3 py-2 text-xs text-white focus:outline-none focus:border-[#ea580c]"
                >
                  {RESTAURANT_TABLES.map((t) => (
                    <option key={t.id} value={t.name}>
                      {t.name} · Capacidad hasta {t.capacity} personas ({t.description})
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Info Form */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-[#bcaaa4] mb-1">
                    Nombre completo *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Ej. Carlos Martínez"
                    className="w-full bg-[#120e0b] border border-[#382a1e] text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#bcaaa4] mb-1">
                    Teléfono móvil (para avisos y WhatsApp) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Ej. +34 612 34 56 78"
                    className="w-full bg-[#120e0b] border border-[#382a1e] text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#bcaaa4] mb-1">
                    Correo electrónico (opcional para recibir resguardo)
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="ejemplo@email.com"
                    className="w-full bg-[#120e0b] border border-[#382a1e] text-white rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[#ea580c]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-medium text-[#bcaaa4] mb-1">
                    Peticiones especiales o intolerancias (opcional)
                  </label>
                  <textarea
                    rows={2}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Ej. Aniversario, trona de bebé, comensal celiaco, queremos probar la entraña o parrillada..."
                    className="w-full bg-[#120e0b] border border-[#382a1e] text-white rounded-lg px-3.5 py-2 text-sm focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 border-t border-[#33261b] flex items-center justify-between gap-4">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs sm:text-sm font-medium text-[#bcaaa4] hover:text-white transition-colors"
                >
                  ← Volver atrás
                </button>

                <button
                  type="submit"
                  className="inline-flex items-center gap-2 px-6 py-3 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-lg transition-colors shadow-md"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Confirmar Mi Reserva Instantánea</span>
                </button>
              </div>
            </form>
          )}

          {step === 3 && confirmedReservation && (
            <div className="space-y-6">
              {/* Success Badge */}
              <div className="bg-[#121c13] border border-[#234527] rounded-xl p-6 text-center space-y-3">
                <div className="w-12 h-12 bg-[#2d5f32] text-white rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-2xl font-bold text-white font-display">
                  ¡Reserva Confirmada en La Rinconada!
                </h3>
                <p className="text-sm text-[#b2d8b6] max-w-lg mx-auto">
                  Tu mesa está garantizada. Te esperamos en Blanes para deleitarte con nuestras brasas al carbón.
                </p>
                <div className="inline-block bg-[#162719] border border-[#336339] px-4 py-1.5 rounded-md text-xs font-mono text-[#a5f3bc]">
                  CÓDIGO DE RESERVA: #{confirmedReservation.code}
                </div>
              </div>

              {/* Prominent Table Assignment Banner */}
              <div className="bg-[#261911] border border-[#ea580c]/40 rounded-xl p-4 flex items-center justify-between gap-4 shadow-lg">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-[#ea580c] font-bold block">
                    Mesa Asignada para el Servicio
                  </span>
                  <p className="text-xl font-bold text-white font-display mt-0.5">
                    {confirmedReservation.tableNumber || 'Mesa 3 (Salón)'}
                  </p>
                  <p className="text-xs text-[#d7ccc8] mt-0.5">
                    Preparada para recibir a {confirmedReservation.guests} {confirmedReservation.guests === 1 ? 'comensal' : 'comensales'}.
                  </p>
                </div>
                <div className="w-12 h-12 rounded-full bg-[#ea580c]/15 border border-[#ea580c]/30 flex items-center justify-center text-[#f97316] shrink-0">
                  <UtensilsCrossed className="w-6 h-6" />
                </div>
              </div>

              {/* Details voucher */}
              <div className="bg-[#120e0b] border border-[#382a1e] rounded-lg p-5 space-y-3 text-sm">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-b border-[#2d2218] pb-4">
                  <div>
                    <span className="text-xs uppercase text-[#8c7b73] block">Fecha</span>
                    <span className="font-semibold text-white">{confirmedReservation.date}</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#8c7b73] block">Hora</span>
                    <span className="font-semibold text-white">{confirmedReservation.time} h</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#8c7b73] block">Comensales</span>
                    <span className="font-semibold text-white">{confirmedReservation.guests} pers.</span>
                  </div>
                  <div>
                    <span className="text-xs uppercase text-[#8c7b73] block">Comedor</span>
                    <span className="font-semibold text-white">Salón Rústico Interior</span>
                  </div>
                </div>

                <div className="text-xs text-[#a89993] space-y-1">
                  <p><strong>Titular:</strong> {confirmedReservation.customerName}</p>
                  <p><strong>Teléfono:</strong> {confirmedReservation.phone}</p>
                  {confirmedReservation.specialRequests && (
                    <p><strong>Notas:</strong> {confirmedReservation.specialRequests}</p>
                  )}
                  <p><strong>Lugar:</strong> {RESTAURANT_INFO.address}</p>
                </div>
              </div>

              {/* Quick Actions for customer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <a
                  href={buildWhatsAppMessage(confirmedReservation)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#25D366] hover:bg-[#1ebc57] rounded-lg transition-colors shadow-sm"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Confirmar vía WhatsApp</span>
                </a>

                <button
                  type="button"
                  onClick={() => downloadCalendarEvent(confirmedReservation)}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#291e16] hover:bg-[#382b21] border border-[#443326] rounded-lg transition-colors"
                >
                  <CalendarPlus className="w-4 h-4 text-[#ea580c]" />
                  <span>Guardar en mi Calendario</span>
                </button>
              </div>

              <div className="text-center pt-2">
                <button
                  type="button"
                  onClick={handleReset}
                  className="text-xs text-[#bcaaa4] hover:text-white underline transition-colors"
                >
                  Hacer otra reserva nueva
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
