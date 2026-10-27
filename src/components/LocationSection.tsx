import React from 'react';
import { MapPin, Clock, Phone, ExternalLink, Navigation, Compass, Calendar } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface LocationSectionProps {
  onOpenBooking: () => void;
}

export const LocationSection: React.FC<LocationSectionProps> = ({ onOpenBooking }) => {
  return (
    <section id="contacto" className="py-16 sm:py-24 bg-[#18130f] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12">
          {/* Left Details */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#ea580c] font-semibold">
                Encuéntranos en Blanes
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mt-1">
                Ubicación & Horarios
              </h2>
              <p className="text-[#d7ccc8] text-sm sm:text-base mt-2 font-light">
                Te esperamos en Blanes, la puerta de entrada a la Costa Brava.
                Fácil acceso a pocos minutos del paseo y la playa.
              </p>
            </div>

            {/* Address Box */}
            <div className="bg-[#201812] border border-[#382b20] rounded-lg p-5 space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Dirección</h3>
                  <p className="text-sm text-[#d7ccc8] mt-0.5">{RESTAURANT_INFO.address}</p>
                  <p className="text-xs text-[#a89993] mt-0.5">Blanes, Girona, Cataluña</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#2d2218]">
                <Clock className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Horarios de Servicio</h3>
                  <div className="text-sm text-[#d7ccc8] mt-1 space-y-1">
                    <p>
                      <strong>Mediodías:</strong> {RESTAURANT_INFO.openingHours.lunch} h
                    </p>
                    <p>
                      <strong>Noches:</strong> {RESTAURANT_INFO.openingHours.dinner} h
                    </p>
                    <p className="text-xs text-[#a89993] pt-0.5">
                      {RESTAURANT_INFO.openingHours.closedDay}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-[#2d2218]">
                <Phone className="w-5 h-5 text-[#ea580c] shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-sm font-semibold text-white">Contacto Telefónico</h3>
                  <a
                    href={`tel:${RESTAURANT_INFO.phoneClean}`}
                    className="text-base font-bold text-[#f97316] hover:underline mt-0.5 block tabular-nums"
                  >
                    {RESTAURANT_INFO.phone}
                  </a>
                  <p className="text-xs text-[#a89993] mt-0.5">
                    Atención directa durante el horario del restaurante
                  </p>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={RESTAURANT_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#261d16] hover:bg-[#34271e] border border-[#443325] rounded-md transition-colors"
              >
                <Navigation className="w-4 h-4 text-[#ea580c]" />
                <span>Abrir en Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5 text-[#a89993]" />
              </a>

              <button
                onClick={onOpenBooking}
                className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-3 text-xs sm:text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] rounded-md transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar Mesa</span>
              </button>
            </div>
          </div>

          {/* Right Map Visual Card */}
          <div className="lg:col-span-7">
            <div className="bg-[#1f1712] border border-[#382a1e] rounded-xl overflow-hidden shadow-xl flex flex-col h-full">
              {/* Map Graphic Preview with Blanes landmark styling */}
              <div className="relative h-72 sm:h-80 bg-[#16110d] overflow-hidden flex items-center justify-center">
                {/* Visual Map Representation */}
                <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#3a2a1d_1px,transparent_1px)] [background-size:16px_16px]" />
                
                <div className="relative text-center p-6 space-y-3 z-10">
                  <div className="w-14 h-14 bg-[#ea580c] text-white rounded-full flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <MapPin className="w-8 h-8" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white font-display">
                      Restaurante Asador La Rinconada
                    </h4>
                    <p className="text-xs sm:text-sm text-[#d7ccc8] mt-1">
                      Blanes · Costa Brava · Girona
                    </p>
                  </div>
                  <a
                    href={RESTAURANT_INFO.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-black/60 hover:bg-black/90 rounded-md border border-white/20 backdrop-blur-sm transition-all"
                  >
                    <span>Ver ficha y cómo llegar en Google Maps</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>

              {/* Tips for visitors */}
              <div className="p-6 bg-[#17120e] border-t border-[#2d2218] space-y-3 text-xs sm:text-sm text-[#bcaaa4]">
                <h5 className="font-semibold text-white text-xs uppercase tracking-wider">
                  Consejos para tu visita:
                </h5>
                <ul className="space-y-1.5 list-disc list-inside">
                  <li>Disponibilidad de aparcamiento en las calles adyacentes y zonas cercanas.</li>
                  <li>Recomendamos reservar con antelación, especialmente los fines de semana y temporada estival.</li>
                  <li>Servicio exclusivo en nuestro acogedor salón comedor interior climatizado con ambiente rústico tradicional.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
