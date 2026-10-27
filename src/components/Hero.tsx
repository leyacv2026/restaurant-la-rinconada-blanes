import React from 'react';
import { Calendar, Users, Clock, MapPin, ArrowRight, PhoneCall } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeroProps {
  onQuickBook: (date?: string, shift?: 'mediodia' | 'noche', guests?: number) => void;
  onOpenBooking: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onQuickBook, onOpenBooking }) => {
  const [quickDate, setQuickDate] = React.useState<string>(() => {
    return new Date().toISOString().split('T')[0];
  });
  const [quickShift, setQuickShift] = React.useState<'mediodia' | 'noche'>('mediodia');
  const [quickGuests, setQuickGuests] = React.useState<number>(2);

  const handleStartBooking = (e: React.FormEvent) => {
    e.preventDefault();
    onQuickBook(quickDate, quickShift, quickGuests);
  };

  return (
    <section className="relative bg-[#16120e] text-[#fbf8f5] overflow-hidden pt-6 pb-16 lg:py-20 border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Info metadata strip: clean unboxed text */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs sm:text-sm text-[#bcaaa4] mb-6">
          <span className="flex items-center gap-1.5 text-[#f97316]">
            <MapPin className="w-4 h-4 shrink-0" />
            <span>Blanes, Costa Brava</span>
          </span>
          <span aria-hidden="true">·</span>
          <span>Asador de Carne al Carbón de Encina</span>
          <span aria-hidden="true">·</span>
          <span>Mediodías {RESTAURANT_INFO.openingHours.lunch}</span>
          <span aria-hidden="true">·</span>
          <span>Noches {RESTAURANT_INFO.openingHours.dinner}</span>
        </div>

        {/* Main Grid: 2 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Left Column: Headline & Value */}
          <div className="lg:col-span-7 space-y-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-display leading-[1.15] text-balance">
              El auténtico asador a las brasas en el corazón de Blanes
            </h1>

            <p className="text-base sm:text-lg text-[#d7ccc8] leading-relaxed max-w-2xl font-light">
              Vacío, entraña jugosa, asado de tira y cortes ibéricos preparados lentamente
              sobre carbón de encina. Un rincón rústico y acogedor en la Costa Brava
              donde el buen comer y la brasa son nuestra razón de ser.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <button
                onClick={onOpenBooking}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-md transition-all shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Mesa Online</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <a
                href={`tel:${RESTAURANT_INFO.phoneClean}`}
                className="inline-flex items-center gap-2 px-5 py-3.5 text-sm font-medium text-[#e6ded8] bg-[#221a14] hover:bg-[#2e231b] border border-[#3e3025] rounded-md transition-colors"
              >
                <PhoneCall className="w-4 h-4 text-[#ea580c]" />
                <span>Llamar al {RESTAURANT_INFO.phone}</span>
              </a>
            </div>

            {/* Authentic Highlights List */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-[#2d241c] text-[#d7ccc8]">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#a89993]">Especialidad</p>
                <p className="text-sm sm:text-base font-semibold text-white mt-0.5">Carnes a la Brasa</p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#a89993]">Menú Diario</p>
                <p className="text-sm sm:text-base font-semibold text-[#f97316] mt-0.5 tabular-nums">
                  {RESTAURANT_INFO.menuPizarraPrice.toFixed(2)} €
                </p>
              </div>
              <div>
                <p className="text-xs uppercase tracking-wider text-[#a89993]">Ambiente</p>
                <p className="text-sm sm:text-base font-semibold text-white mt-0.5">Comedor Rústico Interior</p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual anchor featuring authentic facade & entrance */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#3e3025] bg-[#221a14] shadow-2xl">
              <img
                src="/assets/aistudio/image_ee4b3a67.png"
                alt="Fachada auténtica del Restaurante Asador La Rinconada en Blanes"
                className="w-full h-80 sm:h-96 object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-xs font-medium text-[#f97316] uppercase tracking-wider">
                  Foto Real · Blanes, Costa Brava
                </span>
                <p className="text-base font-semibold font-display mt-1">
                  La Rinconada · Entrada y acceso al salón
                </p>
                <p className="text-xs text-[#d7ccc8] mt-0.5">
                  Escaleras de entrada hacia nuestro acogedor salón comedor interior.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Booking Strip below hero */}
        <div className="mt-12 bg-[#201812] border border-[#3a2d22] rounded-lg p-5 sm:p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <h2 className="text-lg font-bold text-white font-display">
                Reserva rápida de mesa
              </h2>
              <p className="text-xs text-[#bcaaa4] mt-0.5">
                Confirmación instantánea online y recordatorio digital directo.
              </p>
            </div>

            <form
              onSubmit={handleStartBooking}
              className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 flex-1 max-w-3xl"
            >
              {/* Date */}
              <div>
                <label className="block text-xs font-medium text-[#a89993] mb-1">
                  Fecha
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    value={quickDate}
                    onChange={(e) => setQuickDate(e.target.value)}
                    required
                    className="w-full bg-[#16120e] border border-[#3e3025] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  />
                </div>
              </div>

              {/* Shift */}
              <div>
                <label className="block text-xs font-medium text-[#a89993] mb-1">
                  Turno
                </label>
                <div className="relative">
                  <select
                    value={quickShift}
                    onChange={(e) => setQuickShift(e.target.value as 'mediodia' | 'noche')}
                    className="w-full bg-[#16120e] border border-[#3e3025] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    <option value="mediodia">Almuerzo (13:15 - 15:30)</option>
                    <option value="noche">Cena (20:00 - 23:30)</option>
                  </select>
                </div>
              </div>

              {/* Guests */}
              <div>
                <label className="block text-xs font-medium text-[#a89993] mb-1">
                  Comensales
                </label>
                <div className="relative">
                  <select
                    value={quickGuests}
                    onChange={(e) => setQuickGuests(Number(e.target.value))}
                    className="w-full bg-[#16120e] border border-[#3e3025] rounded-md px-3 py-2 text-sm text-white focus:outline-none focus:border-[#ea580c]"
                  >
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map((num) => (
                      <option key={num} value={num}>
                        {num} {num === 1 ? 'persona' : 'personas'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Submit */}
              <div className="sm:col-span-3 lg:col-span-1 flex items-end">
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-md transition-colors"
                >
                  Comprobar
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};
