import React from 'react';
import { Flame, MapPin } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface FooterProps {
  onOpenBooking: () => void;
  onOpenStaffCRM: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenBooking, onOpenStaffCRM }) => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#110d0a] text-[#a89993] border-t border-[#291e16] text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1: Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2 text-white font-bold text-lg font-display">
              <Flame className="w-5 h-5 text-[#ea580c]" />
              <span>LA RINCONADA</span>
            </div>
            <p className="text-xs text-[#8c7b73] leading-relaxed">
              Auténtico Asador de Carne en Blanes, Costa Brava. Especialistas en brasas al carbón vegetal, cortes tradicionales y parrilladas.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Secciones
            </h4>
            <ul className="space-y-1.5">
              <li>
                <a href="#menu" className="hover:text-white transition-colors">
                  Nuestra Carta
                </a>
              </li>
              <li>
                <a href="#pizarra" className="hover:text-white transition-colors">
                  Menú Pizarra (18,50 €)
                </a>
              </li>
              <li>
                <a href="#galeria" className="hover:text-white transition-colors">
                  Galería Real
                </a>
              </li>
              <li>
                <a href="#nosotros" className="hover:text-white transition-colors">
                  El Asador
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Services & Booking */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Reservas & Atención
            </h4>
            <ul className="space-y-1.5">
              <li>
                <button
                  onClick={onOpenBooking}
                  className="hover:text-white text-left transition-colors text-[#ea580c]"
                >
                  Reservar Mesa Online
                </button>
              </li>
              <li>
                <a
                  href={`tel:${RESTAURANT_INFO.phoneClean}`}
                  className="hover:text-white transition-colors"
                >
                  Teléfono: {RESTAURANT_INFO.phone}
                </a>
              </li>
              <li>
                <a
                  href={RESTAURANT_INFO.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors"
                >
                  Cómo llegar (Google Maps)
                </a>
              </li>
            </ul>
          </div>

          {/* Col 4: Horarios */}
          <div className="space-y-2">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">
              Horarios
            </h4>
            <p className="text-xs text-[#d7ccc8]">
              <strong>Mediodía:</strong> {RESTAURANT_INFO.openingHours.lunch}
            </p>
            <p className="text-xs text-[#d7ccc8]">
              <strong>Noche:</strong> {RESTAURANT_INFO.openingHours.dinner}
            </p>
            <p className="text-xs text-[#8c7b73] pt-1">
              {RESTAURANT_INFO.openingHours.closedDay}
            </p>
          </div>
        </div>

        {/* Bottom bar with discreet staff access lock */}
        <div className="pt-8 border-t border-[#221811] flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#786962]">
          <p>© {currentYear} Restaurante Asador de Carne La Rinconada · Blanes (Girona). Todos los derechos reservados.</p>
          
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Blanes, Costa Brava</span>
            </span>

            {/* Staff Portal Entry */}
            <button
              onClick={onOpenStaffCRM}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-[#d7ccc8] hover:text-white bg-[#221812] hover:bg-[#2e2118] border border-[#3e3025] rounded transition-colors"
              title="Acceso Personal / Staff CRM (PIN 17300)"
            >
              <svg className="w-3.5 h-3.5 text-[#ea580c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Acceso Personal / CRM</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
