import React from 'react';
import { Flame, Heart, Sparkles, Award } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="nosotros" className="py-16 sm:py-24 bg-[#140f0c] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Dining Room Photo */}
          <div className="lg:col-span-6 relative">
            <div className="relative rounded-lg overflow-hidden border border-[#3e3025] shadow-2xl bg-[#1c1611]">
              <img
                src="./assets/aistudio/image_f9be9c62.png"
                alt="Comedor interior rústico de La Rinconada con mesas y manteles a cuadros tradicionales"
                className="w-full h-[420px] sm:h-[480px] object-cover object-center"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
              <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
                <span className="text-xs uppercase tracking-wider text-[#f97316] font-semibold">
                  Foto Real del Salón Interior
                </span>
                <p className="text-base font-bold font-display mt-0.5">
                  Un rincón cálido, sin prisas y con alma tradicional
                </p>
                <p className="text-xs text-[#d7ccc8] mt-1">
                  Paredes rústicas, madera de pino y el clásico mantel de cuadros que invita a compartir mesa.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: The Story */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs uppercase tracking-wider text-[#ea580c] font-semibold">
                Nuestra Historia & Filosofía
              </span>
              <h2 className="text-3xl sm:text-4xl font-bold text-white font-display mt-1">
                La pasión por el fuego vivo y el buen corte
              </h2>
            </div>

            <p className="text-[#d7ccc8] text-base leading-relaxed font-light">
              En <strong className="text-white font-semibold">La Rinconada</strong> entendemos el asador como un ritual.
              Lejos de los menús prefabricados y las modas pasajeras, aquí manda el carbón de leña,
              la paciencia sobre la parrilla y el respeto a la materia prima.
            </p>

            <p className="text-[#d7ccc8] text-sm leading-relaxed font-light">
              Ubicados en la bella localidad costera de <strong>Blanes (Costa Brava)</strong>,
              nuestro salón comedor interior ha sido el punto de encuentro de familias,
              amigos y apasionados de la carne que buscan el auténtico vacío jugoso,
              la entraña tierna con chimichurri casero, el churrasco con hueso tostado y el flan artesanal.
            </p>

            {/* Core Values */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="bg-[#1c1611] p-4 rounded-lg border border-[#2f2217]">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <Flame className="w-4 h-4 text-[#ea580c]" />
                  <span>Carbón 100% Vegetal</span>
                </div>
                <p className="text-xs text-[#a89993] mt-1.5 leading-relaxed">
                  Sin gas ni electricidad en el asador. Solo brasa natural de encina para aromatizar cada bocado.
                </p>
              </div>

              <div className="bg-[#1c1611] p-4 rounded-lg border border-[#2f2217]">
                <div className="flex items-center gap-2.5 text-white font-semibold text-sm">
                  <Heart className="w-4 h-4 text-[#ea580c]" />
                  <span>Recetas Caseras</span>
                </div>
                <p className="text-xs text-[#a89993] mt-1.5 leading-relaxed">
                  Empanadas criollas repulgadas a mano, chimichurri macerado y postres de toda la vida.
                </p>
              </div>
            </div>

            {/* Slogan */}
            <div className="pt-2 border-t border-[#2d2218] text-xs text-[#8c7b73]">
              Atención cercana, porciones generosas y una relación calidad-precio honesta desde el primer día.
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
