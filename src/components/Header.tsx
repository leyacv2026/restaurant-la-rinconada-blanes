import React from 'react';
import { Flame, Calendar, BookOpen } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface HeaderProps {
  onOpenBooking: () => void;
  onOpenStaffCRM: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenBooking,
  onOpenStaffCRM,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#16120e]/95 backdrop-blur-md border-b border-[#2d241c] text-[#fbf8f5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-8 h-20">
          {/* Zone 1: Brand wordmark */}
          <a
            href="#"
            className="flex items-center gap-2.5 text-xl sm:text-2xl font-bold tracking-tight text-white hover:text-[#f97316] transition-colors whitespace-nowrap shrink-0 font-display"
          >
            <Flame className="w-6 h-6 text-[#f97316]" />
            <span>LA RINCONADA</span>
          </a>

          {/* Zone 2: Clean single-line text links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-[#d6ccc2]">
            <a
              href="#menu"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Nuestra Carta
            </a>
            <a
              href="#pizarra"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Menú Especial 18,50 €
            </a>
            <a
              href="#galeria"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Fotos Reales
            </a>
            <a
              href="#nosotros"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              El Asador
            </a>
            <a
              href="#contacto"
              className="hover:text-white transition-colors whitespace-nowrap shrink-0"
            >
              Ubicación y Horarios
            </a>
          </nav>

          {/* Zone 3: Actions */}
          <div className="flex items-center gap-2.5 shrink-0">
            {/* Staff CRM Access Button */}
            <button
              onClick={onOpenStaffCRM}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-medium text-[#d7ccc8] hover:text-white bg-[#221812] hover:bg-[#2d2018] border border-[#3e3025] rounded-md transition-colors"
              title="Acceso Gestión / CRM de Reservas (PIN: 17300)"
            >
              <svg className="w-3.5 h-3.5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Acceso CRM</span>
            </button>

            <button
              onClick={onOpenBooking}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 text-xs sm:text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-md transition-colors shadow-sm whitespace-nowrap shrink-0"
            >
              <Calendar className="w-4 h-4" />
              <span>Reservar Mesa</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
