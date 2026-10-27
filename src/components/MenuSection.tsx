import React, { useState } from 'react';
import { MENU_ITEMS } from '../data/restaurantData';
import { MenuItem } from '../types';
import { Utensils, Sparkles, ChefHat } from 'lucide-react';

interface MenuSectionProps {
  onSelectForBooking?: (item: MenuItem) => void;
}

type MenuCategoryFilter = 'all' | 'menu_especial' | 'brasas' | 'entrantes' | 'postres' | 'bodega';

export const MenuSection: React.FC<MenuSectionProps> = ({ onSelectForBooking }) => {
  const [activeCategory, setActiveCategory] = useState<MenuCategoryFilter>('all');

  const filteredItems = MENU_ITEMS.filter((item) => {
    if (activeCategory === 'all') return true;
    return item.category === activeCategory;
  });

  const categories: { key: MenuCategoryFilter; label: string }[] = [
    { key: 'all', label: 'Toda la Carta' },
    { key: 'menu_especial', label: 'Menú Pizarra (18,50 €)' },
    { key: 'brasas', label: 'Carnes a la Brasa' },
    { key: 'entrantes', label: 'Entrantes & Tapas' },
    { key: 'postres', label: 'Postres Caseros' },
    { key: 'bodega', label: 'Vinos & Bebidas' },
  ];

  return (
    <section id="menu" className="py-16 sm:py-24 bg-[#191410] text-[#fbf8f5] border-b border-[#2d241c]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-10">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-wider text-[#ea580c] font-semibold mb-2">
            <ChefHat className="w-4 h-4" />
            <span>Gastronomía Parrillera</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-white font-display">
            Nuestra Carta & Cortes Nobles
          </h2>
          <p className="text-sm sm:text-base text-[#bcaaa4] mt-3 font-light">
            Seleccionamos cada corte para asegurar terneza, infiltración y ese aroma inconfundible
            que solo el carbón vegetal y el tiempo en la parrilla pueden otorgar.
          </p>
        </div>

        {/* Category Filter Tabs (clean segmented button controls) */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-[#120e0a] border border-[#2d2218] rounded-lg max-w-4xl mx-auto mb-12">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.key;
            return (
              <button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                className={`px-3.5 py-2 text-xs sm:text-sm font-medium rounded-md transition-all whitespace-nowrap shrink-0 ${
                  isActive
                    ? 'bg-[#ea580c] text-white shadow-sm'
                    : 'text-[#d6ccc2] hover:text-white hover:bg-[#201812]'
                }`}
              >
                {cat.label}
              </button>
            );
          })}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="bg-[#1f1813] border border-[#33261b] hover:border-[#4b3829] rounded-lg p-5 sm:p-6 flex flex-col justify-between transition-colors shadow-sm"
            >
              <div>
                {/* Image if available */}
                {item.imageUrl && (
                  <div className="mb-4 rounded-md overflow-hidden aspect-[16/9] bg-[#16120e] border border-[#33261b]">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>
                )}

                {/* Title & Price */}
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="text-lg font-bold text-white font-display">
                    {item.name}
                  </h3>
                  <span className="text-lg sm:text-xl font-bold text-[#f97316] font-display tabular-nums shrink-0">
                    {item.price.toFixed(2)} €
                  </span>
                </div>

                {/* Description */}
                <p className="text-sm text-[#bcaaa4] mt-2 leading-relaxed">
                  {item.description}
                </p>

                {/* Unboxed Metadata tags */}
                {item.tags && item.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-[#a89993] mt-3.5 pt-3 border-t border-[#2d2218]">
                    {item.tags.map((tag, i) => (
                      <React.Fragment key={tag}>
                        <span>{tag}</span>
                        {i < item.tags!.length - 1 && <span aria-hidden="true">·</span>}
                      </React.Fragment>
                    ))}
                  </div>
                )}
              </div>

              {/* Action */}
              {onSelectForBooking && (
                <div className="mt-4 pt-3 flex justify-end">
                  <button
                    onClick={() => onSelectForBooking(item)}
                    className="text-xs font-semibold text-[#ea580c] hover:text-[#fb923c] transition-colors"
                  >
                    Pedir en mi reserva →
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Allergen & Quality Note */}
        <div className="mt-12 text-center text-xs text-[#8d7b73] max-w-2xl mx-auto">
          Todas nuestras carnes son aptas para celíacos al ser preparadas en brasa natural sin aditivos.
          Disponemos de carta de alérgenos completa. Si tienes alguna intolerancia, indícalo en el formulario de reserva.
        </div>
      </div>
    </section>
  );
};
