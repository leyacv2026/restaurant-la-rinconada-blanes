import React from 'react';
import { Utensils, CheckCircle2, Calendar } from 'lucide-react';
import { RESTAURANT_INFO } from '../data/restaurantData';

interface PizarraHighlightProps {
  onBookMenu: () => void;
}

export const PizarraHighlight: React.FC<PizarraHighlightProps> = ({ onBookMenu }) => {
  return (
    <section id="pizarra" className="py-16 sm:py-20 bg-[#1f1813] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left: Authentic Entrance Photo showing the chalkboard menu */}
          <div className="lg:col-span-6">
            <div className="relative rounded-lg overflow-hidden border border-[#3e3025] shadow-2xl bg-[#16120e]">
              <img
                src="/assets/aistudio/image_dbf18b95.png"
                alt="Entrada del Asador La Rinconada con el cartel de madera naranja y la pizarra del menú"
                className="w-full h-[450px] sm:h-[500px] object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-xs uppercase tracking-wider text-[#f97316] font-medium">
                  Fotografía Real del Restaurante
                </span>
                <p className="text-lg font-bold font-display mt-0.5">
                  La entrada tradicional & nuestra pizarra de brasas
                </p>
                <p className="text-xs text-[#d7ccc8] mt-1">
                  En el cartel original se leen los cortes diarios preparados al momento.
                </p>
              </div>
            </div>
          </div>

          {/* Right: The Breakdown of the Authentic Board Menu */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#ea580c] font-semibold">
                Nuestra Tradición Más Querida
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mt-1">
                El Menú de la Pizarra
              </h2>
              <p className="text-[#d7ccc8] text-base mt-2">
                Fiel a la pizarra artesana que recibe a cada cliente en nuestras escaleras de Blanes.
                Carne a la brasa con todo incluido a un precio inigualable.
              </p>
            </div>

            {/* Price Banner */}
            <div className="bg-[#291f17] border border-[#443325] rounded-lg p-5 flex items-baseline justify-between">
              <div>
                <p className="text-xs uppercase tracking-wider text-[#a89993]">Precio cerrado por persona</p>
                <p className="text-sm text-[#e6ded8] mt-0.5">Primero + Carne a la brasa + Postre + Bebida</p>
              </div>
              <div className="text-right">
                <span className="text-3xl sm:text-4xl font-bold text-[#f97316] font-display tabular-nums">
                  18,50 €
                </span>
                <span className="text-xs text-[#bcaaa4] block">IVA incluido</span>
              </div>
            </div>

            {/* Cuts Included */}
            <div className="space-y-3">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
                Elige tu corte favorito a la brasa:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-sm text-[#e6ded8]">
                {[
                  'Asado de tira (churrasco jugoso)',
                  'Vacío de ternera a la parrilla',
                  'Entraña a la brasa con chimichurri',
                  'Secreto ibérico con sal marina',
                  'Parrillada combinada de carnes',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-2 bg-[#17120e] p-2.5 rounded border border-[#302319]">
                    <CheckCircle2 className="w-4 h-4 text-[#ea580c] shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Inclusions */}
            <div className="bg-[#18130f] p-4 rounded-md border border-[#2d2218] space-y-2 text-xs sm:text-sm text-[#c5b8b0]">
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>
                  <strong>Guarnición incluida:</strong> Patatas asadas al rescoldo con hierbas o patatas fritas caseras.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>
                  <strong>Postre casero:</strong> Flan de la casa con dulce de leche, tarta casera o postre del día.
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Utensils className="w-4 h-4 text-[#f97316] shrink-0" />
                <span>
                  <strong>Bebida:</strong> Vino de la casa, agua mineral o refresco.
                </span>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onBookMenu}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3.5 text-sm font-semibold text-white bg-[#ea580c] hover:bg-[#c2410c] active:bg-[#9a3412] rounded-md transition-colors shadow-md"
              >
                <Calendar className="w-4 h-4" />
                <span>Reservar para probar este Menú</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
